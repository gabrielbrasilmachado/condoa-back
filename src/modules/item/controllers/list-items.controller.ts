import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { listItemsQuerySchema } from '../schemas/list-items.schema'
import {
  listItemsService,
  listOwnItemsService,
} from '../services/list-items.service'

const UNAUTHORIZED_MESSAGE = 'Token de autenticação inválido ou ausente.'

const parseAuthenticatedUserId = (request: Request): string | null => {
  return request.user?.id ?? null
}

export const listItemsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const authenticatedUserId = parseAuthenticatedUserId(request)

    if (!authenticatedUserId) {
      return response.status(401).json({
        message: UNAUTHORIZED_MESSAGE,
      })
    }

    const query = listItemsQuerySchema.parse(request.query)
    const items = await listItemsService(authenticatedUserId, query)

    return response.status(200).json(items)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    console.error('Falha ao listar itens.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}

export const listOwnItemsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const authenticatedUserId = parseAuthenticatedUserId(request)

    if (!authenticatedUserId) {
      return response.status(401).json({
        message: UNAUTHORIZED_MESSAGE,
      })
    }

    const query = listItemsQuerySchema.parse(request.query)
    const items = await listOwnItemsService(authenticatedUserId, query)

    return response.status(200).json(items)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    console.error('Falha ao listar itens do usuário autenticado.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
