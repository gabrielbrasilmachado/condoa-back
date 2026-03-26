import { type Request, type Response } from 'express'
import { listCondominiumsService } from '../services/list-condominiums.service'

export const listCondominiumsController = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  try {
    const condominiums = await listCondominiumsService()

    return response.status(200).json(condominiums)
  } catch (error: unknown) {
    console.error('Falha ao listar condomínios.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
