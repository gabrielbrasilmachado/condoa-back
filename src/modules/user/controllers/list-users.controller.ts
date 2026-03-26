import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { listUsersQuerySchema } from '../schemas/list-users.schema'
import { listUsersService } from '../services/list-users.service'

export const listUsersController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const query = listUsersQuerySchema.parse(request.query)
    const users = await listUsersService(query)

    return response.status(200).json(users)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json({
        message: 'Parâmetros de listagem inválidos.',
        issues: error.flatten(),
      })
    }

    console.error('Falha ao listar usuários.', error)

    return response.status(500).json({
      message: 'Erro interno do servidor.',
    })
  }
}
