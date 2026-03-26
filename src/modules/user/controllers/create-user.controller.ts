import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { UserCondominiumNotFoundError } from '../errors/user-condominium-not-found.error'
import {
  type CreateUserInput,
  createUserSchema,
} from '../schemas/create-user.schema'
import { createUserService } from '../services/create-user.service'

export const createUserController = async (
  request: Request<unknown, unknown, CreateUserInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = createUserSchema.parse(request.body)
    const user = await createUserService(payload)

    return response.status(201).json(user)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof EmailAlreadyInUseError) {
      return response.status(409).json({ message: error.message })
    }

    if (error instanceof UserCondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao criar usuário.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
