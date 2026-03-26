import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { CondominiumAlreadyExistsError } from '../errors/condominium-already-exists.error'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'
import {
  type UpdateCondominiumInput,
  updateCondominiumSchema,
} from '../schemas/update-condominium.schema'
import { updateCondominiumService } from '../services/update-condominium.service'

type UpdateCondominiumParams = {
  id: string
}

export const updateCondominiumController = async (
  request: Request<UpdateCondominiumParams, unknown, UpdateCondominiumInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateCondominiumSchema.parse(request.body)
    const condominium = await updateCondominiumService(
      request.params.id,
      payload
    )

    return response.status(200).json(condominium)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof CondominiumAlreadyExistsError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao atualizar condomínio.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
