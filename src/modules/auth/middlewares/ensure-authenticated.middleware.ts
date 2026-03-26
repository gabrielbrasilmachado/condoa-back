import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '../../user/enums/user-role.enum'
import { getJwtConfig } from '../config/jwt.config'
import { type AuthenticatedUser } from '../types/authenticated-user.type'
import { type AuthJwtPayload } from '../types/jwt-payload.type'

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

const isUserRole = (value: unknown): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole)
}

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/)

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token.trim()
}

const getUserFromTokenPayload = (
  payload: string | AuthJwtPayload
): AuthenticatedUser | null => {
  if (typeof payload === 'string') {
    return null
  }

  const id = typeof payload.id === 'string' ? payload.id : payload.sub
  const { role } = payload

  if (!id || !isUserRole(role)) {
    return null
  }

  return {
    id,
    role,
  }
}

export const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const token = getBearerToken(request.headers.authorization)

  if (!token) {
    return response.status(401).json({
      message: UNAUTHORIZED_MESSAGE,
    })
  }

  try {
    const { accessSecret } = getJwtConfig()
    const decodedToken = jwt.verify(token, accessSecret) as
      | AuthJwtPayload
      | string
    const authenticatedUser = getUserFromTokenPayload(decodedToken)

    if (!authenticatedUser) {
      return response.status(401).json({
        message: UNAUTHORIZED_MESSAGE,
      })
    }

    request.user = authenticatedUser

    return next()
  } catch (error: unknown) {
    console.error('Falha ao validar token JWT.', error)

    return response.status(401).json({
      message: UNAUTHORIZED_MESSAGE,
    })
  }
}
