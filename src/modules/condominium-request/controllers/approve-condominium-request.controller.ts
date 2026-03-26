import { type Request, type Response } from 'express'
import { CondominiumRequestAlreadyReviewedError } from '../errors/condominium-request-already-reviewed.error'
import { CondominiumRequestApprovalConflictError } from '../errors/condominium-request-approval-conflict.error'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import { approveCondominiumRequestService } from '../services/approve-condominium-request.service'

type ApproveCondominiumRequestParams = {
  id: string
}

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

export const approveCondominiumRequestController = async (
  request: Request<ApproveCondominiumRequestParams>,
  response: Response
): Promise<Response> => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const condominiumRequest = await approveCondominiumRequestService(
      request.params.id,
      request.user.id
    )

    return response.status(200).json(condominiumRequest)
  } catch (error: unknown) {
    if (error instanceof CondominiumRequestNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof CondominiumRequestAlreadyReviewedError) {
      return response.status(409).json({ message: error.message })
    }

    if (error instanceof CondominiumRequestApprovalConflictError) {
      return response.status(409).json({ message: error.message })
    }

    console.error(
      'Falha ao aprovar solicitação de vínculo com condomínio.',
      error
    )

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
