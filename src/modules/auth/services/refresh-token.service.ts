import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../../shared/database/data-source'
import { User } from '../../user/entities/user.entity'
import { toUserResponseDto } from '../../user/mappers/user-response.mapper'
import { RefreshToken } from '../entities/refresh-token.entity'
import { getJwtConfig } from '../config/jwt.config'
import { RefreshTokenInvalidError } from '../errors/refresh-token-invalid.error'
import { type AuthJwtPayload } from '../types/jwt-payload.type'
import { issueAuthTokens } from '../utils/issue-auth-tokens'
import { buildTokenHash } from '../utils/token-hash'

const getRefreshPayload = (token: string): AuthJwtPayload => {
  const { refreshSecret } = getJwtConfig()

  return jwt.verify(token, refreshSecret) as AuthJwtPayload
}

export const refreshTokenService = async (
  refreshToken: string
): Promise<{
  response: { accessToken: string; expiresIn: number }
  refreshToken: string
}> => {
  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
  const userRepository = AppDataSource.getRepository(User)

  let payload: AuthJwtPayload

  try {
    payload = getRefreshPayload(refreshToken)
  } catch {
    throw new RefreshTokenInvalidError()
  }

  const sessionId = payload.sessionId
  const userId = typeof payload.id === 'string' ? payload.id : payload.sub

  if (!sessionId || !userId) {
    throw new RefreshTokenInvalidError()
  }

  const savedRefreshToken = await refreshTokenRepository.findOne({
    where: { id: sessionId, userId },
  })

  if (
    !savedRefreshToken ||
    savedRefreshToken.revokedAt !== null ||
    savedRefreshToken.expiresAt <= new Date() ||
    savedRefreshToken.tokenHash !== buildTokenHash(refreshToken)
  ) {
    throw new RefreshTokenInvalidError()
  }

  const user = await userRepository.findOne({
    where: { id: userId },
  })

  if (!user || user.status !== 'active') {
    throw new RefreshTokenInvalidError()
  }

  savedRefreshToken.revokedAt = new Date()
  await refreshTokenRepository.save(savedRefreshToken)

  const userDto = toUserResponseDto(user)
  const tokens = issueAuthTokens(userDto)

  const nextRefreshToken = refreshTokenRepository.create({
    id: tokens.refreshTokenId,
    userId: user.id,
    tokenHash: buildTokenHash(tokens.refreshToken),
    expiresAt: tokens.refreshExpiresAt,
    revokedAt: null,
  })

  await refreshTokenRepository.save(nextRefreshToken)

  return {
    response: {
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessExpiresInSeconds,
    },
    refreshToken: tokens.refreshToken,
  }
}
