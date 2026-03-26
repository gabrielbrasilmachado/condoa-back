import { type Request, type Response } from 'express'
import { ItemAccessForbiddenError } from '../errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../errors/item-not-found.error'
import { deleteItemService } from '../services/delete-item.service'

type DeleteItemParams = {
  id: string
}

export const deleteItemController = async (
  request: Request<DeleteItemParams>,
  response: Response
): Promise<Response> => {
  try {
    await deleteItemService(request.user!, request.params.id)

    return response.status(204).send()
  } catch (error: unknown) {
    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemAccessForbiddenError) {
      return response.status(403).json({ message: error.message })
    }

    console.error('Falha ao remover item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
