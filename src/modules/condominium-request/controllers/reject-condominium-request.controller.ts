import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { CondominiumRequestAlreadyReviewedError } from '../errors/condominium-request-already-reviewed.error'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import {
  rejectCondominiumRequestSchema,
  type RejectCondominiumRequestInput,
} from '../schemas/reject-condominium-request.schema'
import { rejectCondominiumRequestService } from '../services/reject-condominium-request.service'

type RejectCondominiumRequestParams = {
  id: string
}

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

export const rejectCondominiumRequestController = async (
  request: Request<
    RejectCondominiumRequestParams,
    unknown,
    RejectCondominiumRequestInput
  >,
  response: Response
): Promise<Response> => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const payload = rejectCondominiumRequestSchema.parse(request.body)
    const condominiumRequest = await rejectCondominiumRequestService(
      request.params.id,
      request.user.id,
      payload
    )

    return response.status(200).json(condominiumRequest)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CondominiumRequestNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof CondominiumRequestAlreadyReviewedError) {
      return response.status(409).json({ message: error.message })
    }

    console.error(
      'Falha ao rejeitar solicitação de vínculo com condomínio.',
      error
    )

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
