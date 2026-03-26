import bcrypt from 'bcrypt'
import { AppDataSource } from '../../../shared/database/data-source'
import { toUserResponseDto } from '../../user/mappers/user-response.mapper'
import { User } from '../../user/entities/user.entity'
import { RefreshToken } from '../entities/refresh-token.entity'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { type LoginRequestDto, type LoginResponseDto } from '../dtos/login.dto'
import { buildTokenHash } from '../utils/token-hash'
import { issueAuthTokens } from '../utils/issue-auth-tokens'

const ACTIVE_STATUS = 'active'

export const loginService = async (
  payload: LoginRequestDto
): Promise<{ response: LoginResponseDto; refreshToken: string }> => {
  const userRepository = AppDataSource.getRepository(User)
  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

  const user = await userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email: payload.email })
    .getOne()

  if (!user || user.status !== ACTIVE_STATUS) {
    throw new InvalidCredentialsError()
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password)

  if (!passwordMatches) {
    throw new InvalidCredentialsError()
  }

  const userDto = toUserResponseDto(user)
  const tokens = issueAuthTokens(userDto)

  const refreshTokenEntity = refreshTokenRepository.create({
    id: tokens.refreshTokenId,
    userId: user.id,
    tokenHash: buildTokenHash(tokens.refreshToken),
    expiresAt: tokens.refreshExpiresAt,
    revokedAt: null,
  })

  await refreshTokenRepository.save(refreshTokenEntity)

  return {
    response: {
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessExpiresInSeconds,
      user: userDto,
    },
    refreshToken: tokens.refreshToken,
  }
}
