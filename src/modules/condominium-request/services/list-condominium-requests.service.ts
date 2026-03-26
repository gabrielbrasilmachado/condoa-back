import {
  type ListCondominiumRequestsQueryDto,
  type ListCondominiumRequestsResponseDto,
  type ListOwnCondominiumRequestsQueryDto,
} from '../dtos/list-condominium-requests.dto'
import { AppDataSource } from '../../../shared/database/data-source'
import { CondominiumRequest } from '../entities/condominium-request.entity'
import { toCondominiumRequestResponseDto } from '../mappers/condominium-request-response.mapper'

const sortDirectionMap = {
  asc: 'ASC',
  desc: 'DESC',
} as const

type ListCondominiumRequestsScope =
  | {
      userId: string
      enforceOwnUserOnly: true
    }
  | {
      userId?: string
      condominiumId?: string
      enforceOwnUserOnly?: false
    }

const buildResponse = (
  query: ListCondominiumRequestsQueryDto | ListOwnCondominiumRequestsQueryDto,
  data: ReturnType<typeof toCondominiumRequestResponseDto>[],
  total: number
): ListCondominiumRequestsResponseDto => ({
  data,
  meta: {
    page: query.page,
    perPage: query.perPage,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / query.perPage),
  },
  filters: {
    status: query.status,
    userId: 'userId' in query ? query.userId : undefined,
    condominiumId: 'condominiumId' in query ? query.condominiumId : undefined,
  },
  sort: {
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  },
})

const listByScope = async (
  query: ListCondominiumRequestsQueryDto | ListOwnCondominiumRequestsQueryDto,
  scope: ListCondominiumRequestsScope
): Promise<ListCondominiumRequestsResponseDto> => {
  const repository = AppDataSource.getRepository(CondominiumRequest)
  const skip = (query.page - 1) * query.perPage

  const queryBuilder = repository
    .createQueryBuilder('request')
    .leftJoinAndSelect('request.user', 'user')
    .leftJoinAndSelect('request.condominium', 'condominium')
    .leftJoinAndSelect('request.reviewedBy', 'reviewedBy')

  if (scope.enforceOwnUserOnly) {
    queryBuilder.where('request.userId = :userId', {
      userId: scope.userId,
    })
  } else {
    if (scope.userId) {
      queryBuilder.andWhere('request.userId = :userId', {
        userId: scope.userId,
      })
    }

    if (scope.condominiumId) {
      queryBuilder.andWhere('request.condominiumId = :condominiumId', {
        condominiumId: scope.condominiumId,
      })
    }
  }

  if (query.status) {
    queryBuilder.andWhere('request.status = :status', {
      status: query.status,
    })
  }

  const [requests, total] = await queryBuilder
    .orderBy(`request.${query.sortBy}`, sortDirectionMap[query.sortOrder])
    .skip(skip)
    .take(query.perPage)
    .getManyAndCount()

  return buildResponse(
    query,
    requests.map(toCondominiumRequestResponseDto),
    total
  )
}

export const listCondominiumRequestsService = async (
  query: ListCondominiumRequestsQueryDto
): Promise<ListCondominiumRequestsResponseDto> => {
  return listByScope(query, {
    userId: query.userId,
    condominiumId: query.condominiumId,
  })
}

export const listOwnCondominiumRequestsService = async (
  authenticatedUserId: string,
  query: ListOwnCondominiumRequestsQueryDto
): Promise<ListCondominiumRequestsResponseDto> => {
  return listByScope(query, {
    userId: authenticatedUserId,
    enforceOwnUserOnly: true,
  })
}
