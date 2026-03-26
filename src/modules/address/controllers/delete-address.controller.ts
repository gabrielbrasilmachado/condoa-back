import { type Request, type Response } from 'express'
import { AddressNotFoundError } from '../errors/address-not-found.error'
import { deleteAddressService } from '../services/delete-address.service'

type DeleteAddressParams = {
  id: string
}

export const deleteAddressController = async (
  request: Request<DeleteAddressParams>,
  response: Response
): Promise<Response> => {
  try {
    await deleteAddressService(request.params.id)

    return response.status(204).send()
  } catch (error: unknown) {
    if (error instanceof AddressNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao remover endereço.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
