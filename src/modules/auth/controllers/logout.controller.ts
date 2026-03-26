import { type Request, type Response } from 'express'
import { getJwtConfig } from '../config/jwt.config'
import { logoutService } from '../services/logout.service'
import { parseCookieHeader } from '../utils/parse-cookie-header'

export const logoutController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const jwtConfig = getJwtConfig()
  const cookies = parseCookieHeader(request.headers.cookie)
  const refreshToken = cookies[jwtConfig.refreshCookieName] || null

  await logoutService(refreshToken)

  response.clearCookie(jwtConfig.refreshCookieName, {
    httpOnly: true,
    sameSite: jwtConfig.refreshCookieSameSite,
    secure: jwtConfig.refreshCookieSecure,
    path: jwtConfig.refreshCookiePath,
  })

  return response.status(204).send()
}
