import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { CondominiumRequestAlreadyPendingError } from '../errors/condominium-request-already-pending.error'
import { CondominiumRequestCondominiumNotFoundError } from '../errors/condominium-request-condominium-not-found.error'
import { UserAlreadyLinkedToCondominiumError } from '../errors/user-already-linked-to-condominium.error'
import {
  createCondominiumRequestSchema,
  type CreateCondominiumRequestInput,
} from '../schemas/create-condominium-request.schema'
import { createCondominiumRequestService } from '../services/create-condominium-request.service'

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

export const createCondominiumRequestController = async (
  request: Request<unknown, unknown, CreateCondominiumRequestInput>,
  response: Response
): Promise<Response> => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const payload = createCondominiumRequestSchema.parse(request.body)
    const condominiumRequest = await createCondominiumRequestService(
      request.user.id,
      payload
    )

    return response.status(201).json(condominiumRequest)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CondominiumRequestAlreadyPendingError) {
      return response.status(409).json({ message: error.message })
    }

    if (error instanceof CondominiumRequestCondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof UserAlreadyLinkedToCondominiumError) {
      return response.status(409).json({ message: error.message })
    }

    console.error(
      'Falha ao criar solicitação de vínculo com condomínio.',
      error
    )

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
