import { type Request, type Response } from 'express'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { getUserByIdService } from '../services/get-user-by-id.service'

type GetUserByIdParams = {
  id: string
}

export const getUserByIdController = async (
  request: Request<GetUserByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const user = await getUserByIdService(request.params.id)

    return response.status(200).json(user)
  } catch (error: unknown) {
    if (error instanceof UserNotFoundError) {
      return response.status(404).json({
        message: error.message,
      })
    }

    console.error('Falha ao buscar usuário por id.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
