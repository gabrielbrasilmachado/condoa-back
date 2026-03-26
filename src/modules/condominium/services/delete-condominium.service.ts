import { AppDataSource } from '../../../shared/database/data-source'
import { User } from '../../user/entities/user.entity'
import { Condominium } from '../entities/condominium.entity'
import { CondominiumHasUsersError } from '../errors/condominium-has-users.error'
import { CondominiumNotFoundError } from '../errors/condominium-not-found.error'

export const deleteCondominiumService = async (
  condominiumId: string
): Promise<void> => {
  const condominiumRepository = AppDataSource.getRepository(Condominium)
  const userRepository = AppDataSource.getRepository(User)

  const condominium = await condominiumRepository.findOne({
    where: { id: condominiumId },
  })

  if (!condominium) {
    throw new CondominiumNotFoundError()
  }

  const relatedUser = await userRepository.findOne({
    where: { condominiumId },
    select: { id: true },
  })

  if (relatedUser) {
    throw new CondominiumHasUsersError()
  }

  await condominiumRepository.remove(condominium)
}
