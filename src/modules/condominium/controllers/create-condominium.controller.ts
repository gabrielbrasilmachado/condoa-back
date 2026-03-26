import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { CondominiumAlreadyExistsError } from '../errors/condominium-already-exists.error'
import {
  createCondominiumSchema,
  type CreateCondominiumInput,
} from '../schemas/create-condominium.schema'
import { createCondominiumService } from '../services/create-condominium.service'

export const createCondominiumController = async (
  request: Request<unknown, unknown, CreateCondominiumInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = createCondominiumSchema.parse(request.body)
    const condominium = await createCondominiumService(payload)

    return response.status(201).json(condominium)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CondominiumAlreadyExistsError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao criar condomínio.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
