import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../entities/condominium.entity'

type ListedCondominium = Condominium & {
  usersCount: number
}

export const listCondominiumsService = async (): Promise<
  ListedCondominium[]
> => {
  const condominiumRepository = AppDataSource.getRepository(Condominium)

  return condominiumRepository
    .createQueryBuilder('condominium')
    .leftJoinAndSelect('condominium.address', 'address')
    .loadRelationCountAndMap('condominium.usersCount', 'condominium.users')
    .orderBy('condominium.createdAt', 'DESC')
    .getMany() as Promise<ListedCondominium[]>
}
