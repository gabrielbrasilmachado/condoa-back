import { LessThan } from 'typeorm'
import { AppDataSource } from '../../../shared/database/data-source'
import { Item } from '../entities/item.entity'
import { ItemStatus } from '../enums/item-status.enum'

export const syncExpiredItemsService = async (): Promise<void> => {
  const itemRepository = AppDataSource.getRepository(Item)

  await itemRepository.update(
    {
      status: ItemStatus.AVAILABLE,
      expiredAt: LessThan(new Date()),
    },
    {
      status: ItemStatus.EXPIRED,
    }
  )
}
