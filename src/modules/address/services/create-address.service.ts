import { AppDataSource } from '../../../shared/database/data-source'
import {
  normalizeAddressComplement,
  normalizeAddressNumber,
  normalizeAddressText,
  normalizeAddressZipCode,
} from '../../../shared/utils/normalize-address-comparison'
import { Condominium } from '../../condominium/entities/condominium.entity'
import { Address } from '../entities/address.entity'
import { AddressAlreadyExistsError } from '../errors/address-already-exists.error'
import { AddressCondominiumNotFoundError } from '../errors/address-condominium-not-found.error'
import { type CreateAddressData } from '../schemas/create-address.schema'

export const createAddressService = async (
  data: CreateAddressData
): Promise<Address> => {
  return AppDataSource.transaction(async (manager) => {
    const addressRepository = manager.getRepository(Address)
    const condominiumRepository = manager.getRepository(Condominium)

    const condominium = await condominiumRepository.findOne({
      where: { id: data.condominiumId },
    })

    if (!condominium) {
      throw new AddressCondominiumNotFoundError()
    }

    const existingAddress = await addressRepository.findOne({
      where: { condominiumId: data.condominiumId },
    })

    if (existingAddress) {
      throw new AddressAlreadyExistsError()
    }

    const address = addressRepository.create({
      zipCode: normalizeAddressZipCode(data.zipCode),
      name: normalizeAddressText(data.name),
      number: normalizeAddressNumber(data.number),
      district: normalizeAddressText(data.district),
      city: normalizeAddressText(data.city),
      state: data.state.trim().toUpperCase(),
      complement: normalizeAddressComplement(data.complement),
      condominiumId: data.condominiumId,
    })

    return addressRepository.save(address)
  })
}
