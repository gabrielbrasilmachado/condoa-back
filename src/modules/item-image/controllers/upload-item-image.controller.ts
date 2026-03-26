import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { ItemAccessForbiddenError } from '../../item/errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { ItemImageLimitReachedError } from '../errors/item-image-limit-reached.error'
import {
  type UploadItemImageInput,
  uploadItemImageSchema,
} from '../schemas/upload-item-image.schema'
import { uploadItemImageService } from '../services/upload-item-image.service'

type UploadItemImageParams = {
  itemId: string
}

export const uploadItemImageController = async (
  request: Request<UploadItemImageParams, unknown, UploadItemImageInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = uploadItemImageSchema.parse(request.body)
    const file = request.file

    if (!file) {
      return response.status(400).json({
        message: 'Envie um arquivo de imagem.',
      })
    }

    const itemImage = await uploadItemImageService(
      request.user!,
      request.params.itemId,
      file,
      payload
    )

    return response.status(201).json(itemImage)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemAccessForbiddenError) {
      return response.status(403).json({ message: error.message })
    }

    if (error instanceof ItemImageLimitReachedError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao enviar imagem do item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
