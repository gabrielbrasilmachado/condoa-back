import { type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { formatZodError } from '../../../shared/http/utils/format-zod-error'
import { AddressAlreadyExistsError } from '../errors/address-already-exists.error'
import { AddressCondominiumNotFoundError } from '../errors/address-condominium-not-found.error'
import { AddressNotFoundError } from '../errors/address-not-found.error'
import {
  type UpdateAddressInput,
  updateAddressSchema,
} from '../schemas/update-address.schema'
import { updateAddressService } from '../services/update-address.service'

type UpdateAddressParams = {
  id: string
}

export const updateAddressController = async (
  request: Request<UpdateAddressParams, unknown, UpdateAddressInput>,
  response: Response
): Promise<Response> => {
  try {
    const payload = updateAddressSchema.parse(request.body)
    const address = await updateAddressService(request.params.id, payload)

    return response.status(200).json(address)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return response.status(400).json(formatZodError(error))
    }

    if (error instanceof AddressNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof AddressCondominiumNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    if (error instanceof AddressAlreadyExistsError) {
      return response.status(409).json({ message: error.message })
    }

    console.error('Falha ao atualizar endereço.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
