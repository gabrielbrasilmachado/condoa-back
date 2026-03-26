import { type Request, type Response } from 'express'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import { getCondominiumRequestByIdService } from '../services/get-condominium-request-by-id.service'

type GetCondominiumRequestByIdParams = {
  id: string
}

export const getCondominiumRequestByIdController = async (
  request: Request<GetCondominiumRequestByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const condominiumRequest = await getCondominiumRequestByIdService(
      request.params.id
    )

    return response.status(200).json(condominiumRequest)
  } catch (error: unknown) {
    if (error instanceof CondominiumRequestNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error(
      'Falha ao buscar solicitação de vínculo com condomínio por id.',
      error
    )

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
