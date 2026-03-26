import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { ItemCategoryNotFoundError } from '../errors/item-category-not-found.error'
import { ItemOwnerNotFoundError } from '../errors/item-owner-not-found.error'
import { ItemOwnerWithoutCondominiumError } from '../errors/item-owner-without-condominium.error'
import {
  type CreateItemInput,
  createItemSchema,
} from '../schemas/create-item.schema'
import { createItemService } from '../services/create-item.service'

export const createItemController = async (
  request: Request<unknown, unknown, CreateItemInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = createItemSchema.parse(request.body)
    const item = await createItemService(request.user!, payload)

    return response.status(201).json(item)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof ItemCategoryNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemOwnerNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof ItemOwnerWithoutCondominiumError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao criar item.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
