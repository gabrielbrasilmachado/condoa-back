import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../entities/condominium.entity'
import { CondominiumAlreadyExistsError } from '../errors/condominium-already-exists.error'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'
import { type UpdateCondominiumData } from '../schemas/update-condominium.schema'

export const updateCondominiumService = async (
  condominiumId: string,
  data: UpdateCondominiumData
): Promise<Condominium> => {
  const condominiumRepository = AppDataSource.getRepository(Condominium)

  const condominium = await condominiumRepository.findOne({
    where: { id: condominiumId },
  })

  if (!condominium) {
    throw new CondominiumNotFoundError()
  }

  if (data.name && data.name !== condominium.name) {
    const existingCondominium = await condominiumRepository.findOne({
      where: { name: data.name },
    })

    if (existingCondominium && existingCondominium.id !== condominium.id) {
      throw new CondominiumAlreadyExistsError()
    }
  }

  Object.assign(condominium, data)

  return condominiumRepository.save(condominium)
}
