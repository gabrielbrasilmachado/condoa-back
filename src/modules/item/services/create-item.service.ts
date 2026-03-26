import { AppDataSource } from '../../../shared/database/data-source'
import { type AuthenticatedUser } from '../../auth/types/authenticated-user.type'
import { Category } from '../../category/entities/category.entity'
import { User } from '../../user/entities/user.entity'
import { UserRole } from '../../user/enums/user-role.enum'
import { Item } from '../entities/item.entity'
import { ItemStatus } from '../enums/item-status.enum'
import { ItemCategoryNotFoundError } from '../errors/item-category-not-found.error'
import { ItemOwnerNotFoundError } from '../errors/item-owner-not-found.error'
import { ItemOwnerWithoutCondominiumError } from '../errors/item-owner-without-condominium.error'
import { type CreateItemData } from '../schemas/create-item.schema'

export const createItemService = async (
  authenticatedUser: AuthenticatedUser,
  data: CreateItemData
): Promise<Item> => {
  const itemRepository = AppDataSource.getRepository(Item)
  const categoryRepository = AppDataSource.getRepository(Category)
  const userRepository = AppDataSource.getRepository(User)

  const category = await categoryRepository.findOne({
    where: { id: data.categoryId },
    select: { id: true },
  })

  if (!category) {
    throw new ItemCategoryNotFoundError()
  }

  const ownerId =
    authenticatedUser.role === UserRole.ADMIN && data.userId
      ? data.userId
      : authenticatedUser.id

  const owner = await userRepository.findOne({
    where: { id: ownerId },
    select: { id: true, condominiumId: true },
  })

  if (!owner) {
    throw new ItemOwnerNotFoundError()
  }

  if (!owner.condominiumId) {
    throw new ItemOwnerWithoutCondominiumError()
  }

  const item = itemRepository.create({
    name: data.name,
    description: data.description,
    categoryId: data.categoryId,
    userId: ownerId,
    status: ItemStatus.AVAILABLE,
    expiredAt: data.expiredAt ?? null,
  })

  return itemRepository.save(item)
}
