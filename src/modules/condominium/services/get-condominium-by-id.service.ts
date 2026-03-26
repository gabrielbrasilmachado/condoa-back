import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../entities/condominium.entity'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'

export const getCondominiumByIdService = async (
  condominiumId: string
): Promise<Condominium> => {
  const condominiumRepository = AppDataSource.getRepository(Condominium)

  const condominium = await condominiumRepository.findOne({
    where: { id: condominiumId },
    relations: {
      address: true,
      users: true,
    },
  })

  if (!condominium) {
    throw new CondominiumNotFoundError()
  }

  return condominium
}
