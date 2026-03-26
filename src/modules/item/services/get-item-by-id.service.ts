import { AppDataSource } from '../../../shared/database/data-source'
import { Item } from '../entities/item.entity'
import { ItemNotFoundError } from '../errors/item-not-found.error'
import { syncExpiredItemsService } from './sync-expired-items.service'

export const getItemByIdService = async (itemId: string): Promise<Item> => {
  const itemRepository = AppDataSource.getRepository(Item)

  await syncExpiredItemsService()

  const item = await itemRepository.findOne({
    where: { id: itemId },
    relations: {
      category: true,
      images: true,
      user: true,
    },
  })

  if (!item) {
    throw new ItemNotFoundError()
  }

  return item
}
