import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { getJwtConfig } from '../config/jwt.config'
import { type UserResponseDto } from '../../user/dtos/user-response.dto'
import { expiresInToMilliseconds } from './expires-in'

export type IssuedAuthTokens = {
  accessToken: string
  refreshToken: string
  refreshTokenId: string
  refreshExpiresAt: Date
  accessExpiresInSeconds: number
}

export const issueAuthTokens = (user: UserResponseDto): IssuedAuthTokens => {
  const jwtConfig = getJwtConfig()
  const refreshTokenId = randomUUID()

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    jwtConfig.accessSecret,
    {
      expiresIn: jwtConfig.accessExpiresIn,
    }
  )

  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      sessionId: refreshTokenId,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    }
  )

  const refreshExpiresAt = new Date(
    Date.now() + expiresInToMilliseconds(jwtConfig.refreshExpiresIn)
  )

  return {
    accessToken,
    refreshToken,
    refreshTokenId,
    refreshExpiresAt,
    accessExpiresInSeconds: Math.floor(
      expiresInToMilliseconds(jwtConfig.accessExpiresIn) / 1000
    ),
  }
}
