import { type Request, type Response } from 'express'
import { CondominiumHasUsersError } from '../errors/condominium-has-users.error'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'
import { deleteCondominiumService } from '../services/delete-condominium.service'

type DeleteCondominiumParams = {
  id: string
}

export const deleteCondominiumController = async (
  request: Request<DeleteCondominiumParams>,
  response: Response
): Promise<Response> => {
  try {
    await deleteCondominiumService(request.params.id)

    return response.status(204).send()
  } catch (error: unknown) {
    if (error instanceof CondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof CondominiumHasUsersError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao remover condomínio.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
