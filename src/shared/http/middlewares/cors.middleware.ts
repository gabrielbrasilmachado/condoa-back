import { type NextFunction, type Request, type Response } from 'express'

const ALLOWED_METHODS = 'GET,POST,PATCH,DELETE,OPTIONS'
const ALLOWED_HEADERS = 'Content-Type, Authorization'

const normalizeUrl = (value?: string): string | null => {
  const trimmedValue = value?.trim()

  if (!trimmedValue) {
    return null
  }

  return trimmedValue.replace(/\/+$/, '')
}

const getAllowedOrigin = (): string | null => {
  return normalizeUrl(process.env.FRONTEND_URL)
}

export const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requestOrigin = normalizeUrl(request.headers.origin)
  const allowedOrigin = getAllowedOrigin()

  response.header('Vary', 'Origin')
  response.header('Access-Control-Allow-Methods', ALLOWED_METHODS)
  response.header('Access-Control-Allow-Headers', ALLOWED_HEADERS)

  if (!requestOrigin) {
    if (request.method === 'OPTIONS') {
      return response.status(204).send()
    }

    return next()
  }

  if (!allowedOrigin || requestOrigin !== allowedOrigin) {
    return response.status(403).json({
      message: 'Origem não permitida por CORS.',
    })
  }

  response.header('Access-Control-Allow-Origin', requestOrigin)
  response.header('Access-Control-Allow-Credentials', 'true')

  if (request.method === 'OPTIONS') {
    return response.status(204).send()
  }

  return next()
}
