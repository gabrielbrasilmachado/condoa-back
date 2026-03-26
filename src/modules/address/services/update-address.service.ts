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
import { AddressNotFoundError } from '../errors/address-not-found.error'
import { type UpdateAddressData } from '../schemas/update-address.schema'

export const updateAddressService = async (
  addressId: string,
  data: UpdateAddressData
): Promise<Address> => {
  return AppDataSource.transaction(async (manager) => {
    const addressRepository = manager.getRepository(Address)
    const condominiumRepository = manager.getRepository(Condominium)

    const address = await addressRepository.findOne({
      where: { id: addressId },
    })

    if (!address) {
      throw new AddressNotFoundError()
    }

    const nextCondominiumId = data.condominiumId ?? address.condominiumId

    if (nextCondominiumId !== address.condominiumId) {
      const condominium = await condominiumRepository.findOne({
        where: { id: nextCondominiumId },
      })

      if (!condominium) {
        throw new AddressCondominiumNotFoundError()
      }

      const existingAddress = await addressRepository.findOne({
        where: { condominiumId: nextCondominiumId },
      })

      if (existingAddress && existingAddress.id !== address.id) {
        throw new AddressAlreadyExistsError()
      }
    }

    Object.assign(address, {
      zipCode:
        data.zipCode !== undefined
          ? normalizeAddressZipCode(data.zipCode)
          : address.zipCode,
      name:
        data.name !== undefined
          ? normalizeAddressText(data.name)
          : address.name,
      number:
        data.number !== undefined
          ? normalizeAddressNumber(data.number)
          : address.number,
      district:
        data.district !== undefined
          ? normalizeAddressText(data.district)
          : address.district,
      city:
        data.city !== undefined
          ? normalizeAddressText(data.city)
          : address.city,
      state:
        data.state !== undefined
          ? data.state.trim().toUpperCase()
          : address.state,
      complement:
        data.complement !== undefined
          ? normalizeAddressComplement(data.complement)
          : address.complement,
      condominiumId: nextCondominiumId,
    })

    return addressRepository.save(address)
  })
}
