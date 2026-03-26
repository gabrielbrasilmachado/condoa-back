import { AppDataSource } from '../../../shared/database/data-source'
import { User } from '../../user/entities/user.entity'
import {
  type ListItemsQueryDto,
  type ListItemsResponseDto,
} from '../dtos/list-items.dto'
import { Item } from '../entities/item.entity'
import { toItemListItemDto } from '../mappers/item-list.mapper'
import { syncExpiredItemsService } from './sync-expired-items.service'

const sortDirectionMap = {
  asc: 'ASC',
  desc: 'DESC',
} as const

type ListItemsScope =
  | {
      condominiumId: string
      excludedUserId?: string
      userId?: never
    }
  | {
      condominiumId?: never
      excludedUserId?: never
      userId: string
    }

const buildEmptyListItemsResponse = (
  query: ListItemsQueryDto
): ListItemsResponseDto => {
  const { page, perPage, categoryId, status, sortBy, sortOrder } = query

  return {
    data: [],
    meta: {
      page,
      perPage,
      total: 0,
      totalPages: 0,
    },
    filters: {
      categoryId,
      status,
    },
    sort: {
      sortBy,
      sortOrder,
    },
  }
}

const listItemsByScope = async (
  query: ListItemsQueryDto,
  scope: ListItemsScope
): Promise<ListItemsResponseDto> => {
  const itemRepository = AppDataSource.getRepository(Item)
  const { page, perPage, categoryId, status, sortBy, sortOrder } = query
  const skip = (page - 1) * perPage

  const baseQueryBuilder = itemRepository
    .createQueryBuilder('item')
    .innerJoin('item.user', 'user')

  if ('condominiumId' in scope) {
    baseQueryBuilder.where('user.condominiumId = :condominiumId', {
      condominiumId: scope.condominiumId,
    })

    if (scope.excludedUserId) {
      baseQueryBuilder.andWhere('item.userId != :excludedUserId', {
        excludedUserId: scope.excludedUserId,
      })
    }
  }

  if ('userId' in scope) {
    baseQueryBuilder.where('item.userId = :userId', {
      userId: scope.userId,
    })
  }

  if (categoryId) {
    baseQueryBuilder.andWhere('item.categoryId = :categoryId', {
      categoryId,
    })
  }

  if (status) {
    baseQueryBuilder.andWhere('item.status = :status', {
      status,
    })
  }

  const total = await baseQueryBuilder.clone().getCount()

  const rawPagedItemIds = await baseQueryBuilder
    .clone()
    .select('item.id', 'id')
    .orderBy(`item.${sortBy}`, sortDirectionMap[sortOrder])
    .skip(skip)
    .take(perPage)
    .getRawMany<{ id: string }>()

  const itemIds = rawPagedItemIds.map((item) => item.id)

  if (itemIds.length === 0) {
    return {
      ...buildEmptyListItemsResponse(query),
      meta: {
        page,
        perPage,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
      },
    }
  }

  const items = await itemRepository
    .createQueryBuilder('item')
    .leftJoinAndSelect('item.category', 'category')
    .leftJoinAndSelect('item.images', 'images')
    .leftJoinAndSelect('item.user', 'user')
    .where('item.id IN (:...itemIds)', { itemIds })
    .orderBy(`item.${sortBy}`, sortDirectionMap[sortOrder])
    .addOrderBy('images.isPrimary', 'DESC')
    .addOrderBy('images.createdAt', 'ASC')
    .getMany()

  const sortedItems = itemIds
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter((item): item is Item => !!item)

  return {
    data: sortedItems.map(toItemListItemDto),
    meta: {
      page,
      perPage,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
    },
    filters: {
      categoryId,
      status,
    },
    sort: {
      sortBy,
      sortOrder,
    },
  }
}

export const listItemsService = async (
  authenticatedUserId: string,
  query: ListItemsQueryDto
): Promise<ListItemsResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  await syncExpiredItemsService()

  const authenticatedUser = await userRepository.findOne({
    where: { id: authenticatedUserId },
  })

  if (!authenticatedUser?.condominiumId) {
    return buildEmptyListItemsResponse(query)
  }

  return listItemsByScope(query, {
    condominiumId: authenticatedUser.condominiumId,
    excludedUserId: authenticatedUserId,
  })
}

export const listOwnItemsService = async (
  authenticatedUserId: string,
  query: ListItemsQueryDto
): Promise<ListItemsResponseDto> => {
  await syncExpiredItemsService()

  return listItemsByScope(query, {
    userId: authenticatedUserId,
  })
}
