import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { AddressAlreadyExistsError } from '../errors/address-already-exists.error'
import { AddressCondominiumNotFoundError } from '../errors/address-condominium-not-found.error'
import {
  createAddressSchema,
  type CreateAddressInput,
} from '../schemas/create-address.schema'
import { createAddressService } from '../services/create-address.service'

export const createAddressController = async (
  request: Request<unknown, unknown, CreateAddressInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = createAddressSchema.parse(request.body)
    const address = await createAddressService(payload)

    return response.status(201).json(address)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof AddressCondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof AddressAlreadyExistsError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao criar endereço.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
