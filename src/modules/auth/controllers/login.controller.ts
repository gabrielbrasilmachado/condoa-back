import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { type LoginRequestDto } from '../dtos/login.dto'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { getJwtConfig } from '../config/jwt.config'
import { loginSchema } from '../schemas/login.schema'
import { loginService } from '../services/login.service'
import { expiresInToMilliseconds } from '../utils/expires-in'

export const loginController = async (
  request: Request<unknown, unknown, LoginRequestDto>,
  response: Response
): Promise<Response> => {
  try {
    const payload = loginSchema.parse(request.body)
    const result = await loginService(payload)
    const jwtConfig = getJwtConfig()

    response.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
      httpOnly: true,
      sameSite: jwtConfig.refreshCookieSameSite,
      secure: jwtConfig.refreshCookieSecure,
      path: jwtConfig.refreshCookiePath,
      maxAge: expiresInToMilliseconds(jwtConfig.refreshExpiresIn),
    })

    return response.status(200).json(result.response)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof InvalidCredentialsError) {
      return response.status(401).json({
        message: error.message,
      })
    }

    console.error('Falha ao realizar login.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
