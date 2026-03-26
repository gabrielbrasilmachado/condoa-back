import { type Request, type Response } from 'express'
import { ItemNotFoundError } from '../errors/item-not-found.error'
import { getItemByIdService } from '../services/get-item-by-id.service'

type GetItemByIdParams = {
  id: string
}

export const getItemByIdController = async (
  request: Request<GetItemByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const item = await getItemByIdService(request.params.id)

    return response.status(200).json(item)
  } catch (error: unknown) {
    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao buscar item por id.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
