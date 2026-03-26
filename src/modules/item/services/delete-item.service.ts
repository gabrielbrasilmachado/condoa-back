import { AppDataSource } from '../../../shared/database/data-source'
import { type AuthenticatedUser } from '../../auth/types/authenticated-user.type'
import { UserRole } from '../../user/enums/user-role.enum'
import { Item } from '../entities/item.entity'
import { ItemAccessForbiddenError } from '../errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../errors/item-not-found.error'

export const deleteItemService = async (
  authenticatedUser: AuthenticatedUser,
  itemId: string
): Promise<void> => {
  const itemRepository = AppDataSource.getRepository(Item)

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

  await itemRepository.remove(item)
}
