import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../../shared/database/data-source'
import { RefreshToken } from '../entities/refresh-token.entity'
import { getJwtConfig } from '../config/jwt.config'
import { type AuthJwtPayload } from '../types/jwt-payload.type'
import { buildTokenHash } from '../utils/token-hash'

export const logoutService = async (
  refreshToken: string | null
): Promise<void> => {
  if (!refreshToken) {
    return
  }

  try {
    const { refreshSecret } = getJwtConfig()
    const payload = jwt.verify(refreshToken, refreshSecret) as AuthJwtPayload
    const sessionId = payload.sessionId
    const userId = typeof payload.id === 'string' ? payload.id : payload.sub

    if (!sessionId || !userId) {
      return
    }

    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
    const savedRefreshToken = await refreshTokenRepository.findOne({
      where: { id: sessionId, userId },
    })

    if (!savedRefreshToken || savedRefreshToken.revokedAt !== null) {
      return
    }

    if (savedRefreshToken.tokenHash !== buildTokenHash(refreshToken)) {
      return
    }

    savedRefreshToken.revokedAt = new Date()
    await refreshTokenRepository.save(savedRefreshToken)
  } catch {
    return
  }
}
