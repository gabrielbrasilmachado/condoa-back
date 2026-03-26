import { type Request, type Response } from 'express'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { listItemImagesService } from '../services/list-item-images.service'

type ListItemImagesParams = {
  itemId: string
}

export const listItemImagesController = async (
  request: Request<ListItemImagesParams>,
  response: Response
): Promise<Response> => {
  try {
    const itemImages = await listItemImagesService(request.params.itemId)

    return response.status(200).json(itemImages)
  } catch (error: unknown) {
    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao listar imagens do item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
