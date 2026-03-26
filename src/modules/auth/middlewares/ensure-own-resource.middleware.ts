import { type NextFunction, type Request, type Response } from 'express'

type OwnerIdResolver = (
  request: Request
) => string | null | undefined | Promise<string | null | undefined>

type EnsureOwnResourceOptions = {
  resolveOwnerId: OwnerIdResolver
  forbiddenMessage?: string
}

const DEFAULT_FORBIDDEN_MESSAGE =
  'Você não tem permissão para acessar este recurso.'

export const ensureOwnResource = ({
  resolveOwnerId,
  forbiddenMessage = DEFAULT_FORBIDDEN_MESSAGE,
}: EnsureOwnResourceOptions) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const authenticatedUserId = request.user?.id

    if (!authenticatedUserId) {
      return response.status(401).json({
        message: 'Token de autenticação inválido ou ausente.',
      })
    }

    const ownerId = await resolveOwnerId(request)

    if (!ownerId || ownerId !== authenticatedUserId) {
      return response.status(403).json({
        message: forbiddenMessage,
      })
    }

    return next()
  }
}
