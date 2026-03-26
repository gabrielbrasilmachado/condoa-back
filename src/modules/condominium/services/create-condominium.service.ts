import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../entities/condominium.entity'
import { CondominiumAlreadyExistsError } from '../errors/condominium-already-exists.error'
import { type CreateCondominiumData } from '../schemas/create-condominium.schema'

export const createCondominiumService = async (
  data: CreateCondominiumData
): Promise<Condominium> => {
  const condominiumRepository = AppDataSource.getRepository(Condominium)

  const existingCondominium = await condominiumRepository.findOne({
    where: { name: data.name },
  })

  if (existingCondominium) {
    throw new CondominiumAlreadyExistsError()
  }

  const condominium = condominiumRepository.create({
    name: data.name,
  })

  return condominiumRepository.save(condominium)
}
