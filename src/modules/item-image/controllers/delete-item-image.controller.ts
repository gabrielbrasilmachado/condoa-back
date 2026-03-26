import { type Request, type Response } from 'express'
import { ItemAccessForbiddenError } from '../../item/errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { ItemImageNotFoundError } from '../errors/item-image-not-found.error'
import { deleteItemImageService } from '../services/delete-item-image.service'

type DeleteItemImageParams = {
  itemId: string
  imageId: string
}

export const deleteItemImageController = async (
  request: Request<DeleteItemImageParams>,
  response: Response
): Promise<Response> => {
  try {
    await deleteItemImageService(
      request.user!,
      request.params.itemId,
      request.params.imageId
    )

    return response.status(204).send()
  } catch (error: unknown) {
    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemAccessForbiddenError) {
      return response.status(403).json({ message: error.message })
    }

    if (error instanceof ItemImageNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao remover imagem do item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
