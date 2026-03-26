import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import {
  listCondominiumRequestsQuerySchema,
  listOwnCondominiumRequestsQuerySchema,
} from '../schemas/list-condominium-requests.schema'
import {
  listCondominiumRequestsService,
  listOwnCondominiumRequestsService,
} from '../services/list-condominium-requests.service'

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

export const listCondominiumRequestsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const query = listCondominiumRequestsQuerySchema.parse(request.query)
    const requests = await listCondominiumRequestsService(query)

    return response.status(200).json(requests)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    console.error(
      'Falha ao listar solicitações de vínculo com condomínio.',
      error
    )

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}

export const listOwnCondominiumRequestsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const query = listOwnCondominiumRequestsQuerySchema.parse(request.query)
    const requests = await listOwnCondominiumRequestsService(
      request.user.id,
      query
    )

    return response.status(200).json(requests)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    console.error('Falha ao listar solicitações do usuário autenticado.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
