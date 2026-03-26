import { type Request, type Response } from 'express'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'
import { getCondominiumByIdService } from '../services/get-condominium-by-id.service'

type GetCondominiumByIdParams = {
  id: string
}

export const getCondominiumByIdController = async (
  request: Request<GetCondominiumByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const condominium = await getCondominiumByIdService(request.params.id)

    return response.status(200).json(condominium)
  } catch (error: unknown) {
    if (error instanceof CondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao buscar condomínio por id.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
