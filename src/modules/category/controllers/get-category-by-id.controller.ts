import { type Request, type Response } from 'express'
import { CategoryNotFoundError } from '../errors/category-not-found.error'
import { getCategoryByIdService } from '../services/get-category-by-id.service'

type GetCategoryByIdParams = {
  id: string
}

export const getCategoryByIdController = async (
  request: Request<GetCategoryByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const category = await getCategoryByIdService(request.params.id)

    return response.status(200).json(category)
  } catch (error: unknown) {
    if (error instanceof CategoryNotFoundError) {
      return response.status(404).json({
        message: error.message,
      })
    }

    console.error('Falha ao buscar categoria por id.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
