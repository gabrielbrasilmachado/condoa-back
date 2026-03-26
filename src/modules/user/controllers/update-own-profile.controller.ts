import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { InvalidCurrentPasswordError } from '../errors/invalid-current-password.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import {
  type UpdateOwnProfileInput,
  updateOwnProfileSchema,
} from '../schemas/update-own-profile.schema'
import { updateOwnProfileService } from '../services/update-own-profile.service'

type UpdateOwnProfileParams = {
  id: string
}

export const updateOwnProfileController = async (
  request: Request<UpdateOwnProfileParams, unknown, UpdateOwnProfileInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateOwnProfileSchema.parse(request.body)
    const updatedUser = await updateOwnProfileService(
      request.params.id,
      payload
    )

    return response.status(200).json(updatedUser)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof EmailAlreadyInUseError) {
      return response.status(409).json({ message: error.message })
    }

    if (error instanceof InvalidCurrentPasswordError) {
      return response.status(401).json({ message: error.message })
    }

    if (error instanceof UserNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao atualizar perfil do usuário.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
