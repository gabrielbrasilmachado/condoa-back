import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import {
  type UpdateUserStatusInput,
  updateUserStatusSchema,
} from '../schemas/update-user-status.schema'
import { updateUserStatusService } from '../services/update-user-status.service'

type UpdateUserStatusParams = {
  id: string
}

export const updateUserStatusController = async (
  request: Request<UpdateUserStatusParams, unknown, UpdateUserStatusInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateUserStatusSchema.parse(request.body)
    const updatedUser = await updateUserStatusService(
      request.params.id,
      payload
    )

    return response.status(200).json(updatedUser)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof UserNotFoundError) {
      return response.status(404).json({
        message: error.message,
      })
    }

    console.error('Falha ao atualizar status do usuário.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
