import { AppDataSource } from '../../../shared/database/data-source'
import { Item } from '../../item/entities/item.entity'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { ItemImage } from '../entities/item-image.entity'

export const listItemImagesService = async (
  itemId: string
): Promise<ItemImage[]> => {
  const itemRepository = AppDataSource.getRepository(Item)
  const itemImageRepository = AppDataSource.getRepository(ItemImage)

  const item = await itemRepository.findOne({
    where: { id: itemId },
    select: { id: true },
  })

  if (!item) {
    throw new ItemNotFoundError()
  }

  return itemImageRepository.find({
    where: { itemId },
    order: {
      isPrimary: 'DESC',
      createdAt: 'ASC',
    },
  })
}
