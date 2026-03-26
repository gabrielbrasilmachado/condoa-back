import { type Request, type Response } from 'express'
import { getJwtConfig } from '../config/jwt.config'
import { RefreshTokenInvalidError } from '../errors/refresh-token-invalid.error'
import { refreshTokenService } from '../services/refresh-token.service'
import { expiresInToMilliseconds } from '../utils/expires-in'
import { parseCookieHeader } from '../utils/parse-cookie-header'

export const refreshTokenController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const jwtConfig = getJwtConfig()
    const cookies = parseCookieHeader(request.headers.cookie)
    const refreshToken = cookies[jwtConfig.refreshCookieName]

    if (!refreshToken) {
      return response.status(401).json({
        message: new RefreshTokenInvalidError().message,
      })
    }

    const result = await refreshTokenService(refreshToken)

    response.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
      httpOnly: true,
      sameSite: jwtConfig.refreshCookieSameSite,
      secure: jwtConfig.refreshCookieSecure,
      path: jwtConfig.refreshCookiePath,
      maxAge: expiresInToMilliseconds(jwtConfig.refreshExpiresIn),
    })

    return response.status(200).json(result.response)
  } catch (error: unknown) {
    if (error instanceof RefreshTokenInvalidError) {
      return response.status(401).json({
        message: error.message,
      })
    }

    console.error('Falha ao renovar access token.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
