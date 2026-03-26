import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { UserCondominiumNotFoundError } from '../errors/user-condominium-not-found.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import {
  type AdminUpdateUserInput,
  adminUpdateUserSchema,
} from '../schemas/admin-update-user.schema'
import { adminUpdateUserService } from '../services/admin-update-user.service'

type AdminUpdateUserParams = {
  id: string
}

export const adminUpdateUserController = async (
  request: Request<AdminUpdateUserParams, unknown, AdminUpdateUserInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = adminUpdateUserSchema.parse(request.body)
    const updatedUser = await adminUpdateUserService(request.params.id, payload)

    return response.status(200).json(updatedUser)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof EmailAlreadyInUseError) {
      return response.status(409).json({ message: error.message })
    }

    if (error instanceof UserCondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof UserNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao atualizar usuário pelo admin.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
