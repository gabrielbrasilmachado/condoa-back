import { AppDataSource } from '../../../shared/database/data-source'
import { Address } from '../entities/address.entity'
import { AddressNotFoundError } from '../errors/address-not-found.error'

export const deleteAddressService = async (
  addressId: string
): Promise<void> => {
  const addressRepository = AppDataSource.getRepository(Address)

  const address = await addressRepository.findOne({
    where: { id: addressId },
  })

  if (!address) {
    throw new AddressNotFoundError()
  }

  await addressRepository.remove(address)
}
