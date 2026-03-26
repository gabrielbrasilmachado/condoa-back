import { type Request, type Response } from 'express'
import { listAddressesService } from '../services/list-addresses.service'

export const listAddressesController = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  try {
    const addresses = await listAddressesService()

    return response.status(200).json(addresses)
  } catch (error: unknown) {
    console.error('Falha ao listar endereços.', error)

    return response.status(500).json({ message: 'Erro interno do servidor.' })
  }
}
