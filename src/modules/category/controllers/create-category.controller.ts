import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import {
  createCategorySchema,
  type CreateCategoryInput,
} from '../schemas/create-category.schema'
import { CategoryAlreadyExistsError } from '../errors/category-already-exists.error'
import { createCategoryService } from '../services/create-category.service'

export const createCategoryController = async (
  request: Request<unknown, unknown, CreateCategoryInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = createCategorySchema.parse(request.body)
    const category = await createCategoryService(payload)

    return response.status(201).json(category)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CategoryAlreadyExistsError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    console.error('Falha ao criar categoria.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
