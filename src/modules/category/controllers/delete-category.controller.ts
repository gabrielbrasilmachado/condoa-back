import { type Request, type Response } from 'express'
import { CategoryHasItemsError } from '../errors/category-has-items.error'
import { CategoryNotFoundError } from '../errors/category-not-found.error'
import { deleteCategoryService } from '../services/delete-category.service'

type DeleteCategoryParams = {
  id: string
}

export const deleteCategoryController = async (
  request: Request<DeleteCategoryParams>,
  response: Response
): Promise<Response> => {
  try {
    await deleteCategoryService(request.params.id)

    return response.status(204).send()
  } catch (error: unknown) {
    if (error instanceof CategoryNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof CategoryHasItemsError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao remover categoria.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
