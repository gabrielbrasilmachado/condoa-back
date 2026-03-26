import { type Request, type Response } from 'express'
import { AddressNotFoundError } from '../errors/address-not-found.error'
import { getAddressByIdService } from '../services/get-address-by-id.service'

type GetAddressByIdParams = {
  id: string
}

export const getAddressByIdController = async (
  request: Request<GetAddressByIdParams>,
  response: Response
): Promise<Response> => {
  try {
    const address = await getAddressByIdService(request.params.id)

    return response.status(200).json(address)
  } catch (error: unknown) {
    if (error instanceof AddressNotFoundError) {
      return response.status(404).json({ message: error.message })
    }

    console.error('Falha ao buscar endereço por id.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
