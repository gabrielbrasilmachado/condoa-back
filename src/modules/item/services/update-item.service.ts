import { AppDataSource } from '../../../shared/database/data-source'
import { type AuthenticatedUser } from '../../auth/types/authenticated-user.type'
import { Category } from '../../category/entities/category.entity'
import { UserRole } from '../../user/enums/user-role.enum'
import { Item } from '../entities/item.entity'
import { ItemAccessForbiddenError } from '../errors/item-access-forbidden.error'
import { ItemCategoryNotFoundError } from '../errors/item-category-not-found.error'
import { ItemNotFoundError } from '../errors/item-not-found.error'
import { type UpdateItemData } from '../schemas/update-item.schema'

export const updateItemService = async (
  authenticatedUser: AuthenticatedUser,
  itemId: string,
  data: UpdateItemData
): Promise<Item> => {
  const itemRepository = AppDataSource.getRepository(Item)
  const categoryRepository = AppDataSource.getRepository(Category)

  const item = await itemRepository.findOne({
    where: { id: itemId },
  })

  if (!item) {
    throw new ItemNotFoundError()
  }

  if (
    authenticatedUser.role !== UserRole.ADMIN &&
    item.userId !== authenticatedUser.id
  ) {
    throw new ItemAccessForbiddenError()
  }

  if (data.categoryId) {
    const category = await categoryRepository.findOne({
      where: { id: data.categoryId },
      select: { id: true },
    })

    if (!category) {
      throw new ItemCategoryNotFoundError()
    }
  }

  Object.assign(item, data)

  return itemRepository.save(item)
}
