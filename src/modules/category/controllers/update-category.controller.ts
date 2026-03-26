import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { CategoryAlreadyExistsError } from '../errors/category-already-exists.error'
import { CategoryNotFoundError } from '../errors/category-not-found.error'
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from '../schemas/update-category.schema'
import { updateCategoryService } from '../services/update-category.service'

type UpdateCategoryParams = {
  id: string
}

export const updateCategoryController = async (
  request: Request<UpdateCategoryParams, unknown, UpdateCategoryInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateCategorySchema.parse(request.body)
    const category = await updateCategoryService(request.params.id, payload)

    return response.status(200).json(category)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof CategoryNotFoundError) {
      return response.status(404).json({
        message: error.message,
      })
    }

    if (error instanceof CategoryAlreadyExistsError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    console.error('Falha ao atualizar categoria.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
