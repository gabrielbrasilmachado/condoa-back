import { type Request, type Response } from 'express'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { deactivateOwnProfileService } from '../services/deactivate-own-profile.service'

type DeactivateOwnProfileParams = {
  id: string
}

export const deactivateOwnProfileController = async (
  request: Request<DeactivateOwnProfileParams>,
  response: Response
): Promise<Response> => {
  try {
    const updatedUser = await deactivateOwnProfileService(request.params.id)

    return response.status(200).json(updatedUser)
  } catch (error: unknown) {
    if (error instanceof UserNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao desativar perfil do usuário.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
