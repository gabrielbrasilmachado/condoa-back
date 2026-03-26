import { type Request, type Response } from 'express'
import { getItemAnalyticsService } from '../services/get-item-analytics.service'

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

export const getItemAnalyticsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: UNAUTHORIZED_MESSAGE,
      })
    }

    const analytics = await getItemAnalyticsService(request.user.id)

    return response.status(200).json(analytics)
  } catch (error: unknown) {
    console.error('Falha ao obter análise de itens.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
