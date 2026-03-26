import { type Request, type Response } from 'express'
import { listCategoriesService } from '../services/list-categories.service'

export const listCategoriesController = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  try {
    const categories = await listCategoriesService()

    return response.status(200).json(categories)
  } catch (error: unknown) {
    console.error('Falha ao listar categorias.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
