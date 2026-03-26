import { AppDataSource } from '../../../shared/database/data-source'
import { Address } from '../entities/address.entity'

export const listAddressesService = async (): Promise<Address[]> => {
  const addressRepository = AppDataSource.getRepository(Address)

  return addressRepository.find({
    relations: {
      condominium: true,
    },
    order: {
      city: 'ASC',
      district: 'ASC',
    },
  })
}
