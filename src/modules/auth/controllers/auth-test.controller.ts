import { type Request, type Response } from 'express'
import { UserNotFoundError } from '../../user/errors/user-not-found.error'
import { getMeService } from '../services/get-me.service'

export const authTestController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const user = await getMeService(request.user!.id)

    return response.status(200).json(user)
  } catch (error: unknown) {
    if (error instanceof UserNotFoundError) {
      return response.status(404).json({
        message: error.message,
      })
    }

    console.error('Falha ao recuperar usuário autenticado.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
