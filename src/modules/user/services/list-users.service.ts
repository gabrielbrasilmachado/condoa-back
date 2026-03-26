import { AppDataSource } from '../../../shared/database/data-source'
import {
  type ListUsersQueryDto,
  type ListUsersResponseDto,
} from '../dtos/list-users.dto'
import { User } from '../entities/user.entity'
import { toUserListItemDto } from '../mappers/user-response.mapper'

const sortDirectionMap = {
  asc: 'ASC',
  desc: 'DESC',
} as const

export const listUsersService = async (
  query: ListUsersQueryDto
): Promise<ListUsersResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)
  const { page, perPage, name, email, condominiumId, sortBy, sortOrder } = query
  const skip = (page - 1) * perPage

  const queryBuilder = userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.condominium', 'condominium')

  if (name) {
    queryBuilder.andWhere('user.name ILIKE :name', {
      name: `%${name}%`,
    })
  }

  if (email) {
    queryBuilder.andWhere('user.email ILIKE :email', {
      email: `%${email}%`,
    })
  }

  if (condominiumId) {
    queryBuilder.andWhere('user.condominiumId = :condominiumId', {
      condominiumId,
    })
  }

  const [users, total] = await queryBuilder
    .orderBy(`user.${sortBy}`, sortDirectionMap[sortOrder])
    .skip(skip)
    .take(perPage)
    .getManyAndCount()

  return {
    data: users.map((element) => toUserListItemDto(element)),
    meta: {
      page,
      perPage,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
    },
    filters: {
      name,
      email,
      condominiumId,
    },
    sort: {
      sortBy,
      sortOrder,
    },
  }
}
