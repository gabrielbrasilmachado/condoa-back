import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { ItemAccessForbiddenError } from '../errors/item-access-forbidden.error'
import { ItemCategoryNotFoundError } from '../errors/item-category-not-found.error'
import { ItemNotFoundError } from '../errors/item-not-found.error'
import {
  type UpdateItemInput,
  updateItemSchema,
} from '../schemas/update-item.schema'
import { updateItemService } from '../services/update-item.service'

type UpdateItemParams = {
  id: string
}

export const updateItemController = async (
  request: Request<UpdateItemParams, unknown, UpdateItemInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateItemSchema.parse(request.body)
    const item = await updateItemService(
      request.user!,
      request.params.id,
      payload
    )

    return response.status(200).json(item)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof ItemNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemCategoryNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemAccessForbiddenError) {
      return response.status(403).json({ message: error.message })
    }

    console.error('Falha ao atualizar item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
