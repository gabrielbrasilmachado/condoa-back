import { type NextFunction, type Request, type Response } from 'express'
import { UserRole } from '../../user/enums/user-role.enum'

type AuthorizeInput = UserRole | UserRole[]

const FORBIDDEN_MESSAGE = 'Você não tem permissão para acessar este recurso.'

const normalizeAllowedRoles = (allowedRoles: AuthorizeInput[]): UserRole[] => {
  return allowedRoles.flatMap((role) => {
    return Array.isArray(role) ? role : [role]
  })
}

export const authorize =
  (...allowedRoles: AuthorizeInput[]) =>
  (
    request: Request,
    response: Response,
    next: NextFunction
  ): Response | void => {
    const userRole = request.user?.role
    const normalizedAllowedRoles = normalizeAllowedRoles(allowedRoles)

    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      return response.status(403).json({
        message: FORBIDDEN_MESSAGE,
      })
    }

    return next()
  }
