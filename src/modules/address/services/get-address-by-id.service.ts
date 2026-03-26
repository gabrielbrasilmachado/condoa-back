import { AppDataSource } from '../../../shared/database/data-source'
import { Address } from '../entities/address.entity'
import { AddressNotFoundError } from '../errors/address-not-found.error'

export const getAddressByIdService = async (
  addressId: string
): Promise<Address> => {
  const addressRepository = AppDataSource.getRepository(Address)

  const address = await addressRepository.findOne({
    where: { id: addressId },
    relations: {
      condominium: true,
    },
  })

  if (!address) {
    throw new AddressNotFoundError()
  }

  return address
}
