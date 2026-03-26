import { AppDataSource } from '../../../shared/database/data-source'
import { User } from '../../user/entities/user.entity'
import { type ItemAnalyticsResponseDto } from '../dtos/item-analytics.dto'
import { ItemStatus } from '../enums/item-status.enum'
import { Item } from '../entities/item.entity'
import { syncExpiredItemsService } from './sync-expired-items.service'

const buildEmptyStatusCounts = () => ({
  [ItemStatus.AVAILABLE]: 0,
  [ItemStatus.DONATED]: 0,
  [ItemStatus.EXPIRED]: 0,
})

export const getItemAnalyticsService = async (
  authenticatedUserId: string
): Promise<ItemAnalyticsResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)
  const itemRepository = AppDataSource.getRepository(Item)

  await syncExpiredItemsService()

  const authenticatedUser = await userRepository.findOne({
    where: { id: authenticatedUserId },
  })

  if (!authenticatedUser?.condominiumId) {
    return {
      status: buildEmptyStatusCounts(),
      categories: [],
    }
  }

  const statusRows = await itemRepository
    .createQueryBuilder('item')
    .innerJoin('item.user', 'user')
    .select('item.status', 'status')
    .addSelect('COUNT(item.id)', 'count')
    .where('user.condominiumId = :condominiumId', {
      condominiumId: authenticatedUser.condominiumId,
    })
    .groupBy('item.status')
    .getRawMany<{ status: ItemStatus; count: string }>()

  const categoryRows = await itemRepository
    .createQueryBuilder('item')
    .innerJoin('item.user', 'user')
    .innerJoin('item.category', 'category')
    .select('category.id', 'id')
    .addSelect('category.name', 'name')
    .addSelect('COUNT(item.id)', 'count')
    .where('user.condominiumId = :condominiumId', {
      condominiumId: authenticatedUser.condominiumId,
    })
    .groupBy('category.id')
    .addGroupBy('category.name')
    .orderBy('COUNT(item.id)', 'DESC')
    .addOrderBy('category.name', 'ASC')
    .getRawMany<{ id: string; name: string; count: string }>()

  const status = buildEmptyStatusCounts()

  for (const row of statusRows) {
    status[row.status] = Number(row.count)
  }

  return {
    status,
    categories: categoryRows.map((row) => ({
      id: row.id,
      name: row.name,
      count: Number(row.count),
    })),
  }
}
