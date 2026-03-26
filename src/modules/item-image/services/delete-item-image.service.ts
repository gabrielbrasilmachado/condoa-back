import { AppDataSource } from '../../../shared/database/data-source'
import { storageProvider } from '../../../shared/storage'
import { type AuthenticatedUser } from '../../auth/types/authenticated-user.type'
import { UserRole } from '../../user/enums/user-role.enum'
import { Item } from '../../item/entities/item.entity'
import { ItemAccessForbiddenError } from '../../item/errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { ItemImage } from '../entities/item-image.entity'
import { ItemImageNotFoundError } from '../errors/item-image-not-found.error'

export const deleteItemImageService = async (
  authenticatedUser: AuthenticatedUser,
  itemId: string,
  imageId: string
): Promise<void> => {
  const itemRepository = AppDataSource.getRepository(Item)
  const itemImageRepository = AppDataSource.getRepository(ItemImage)

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

  const itemImage = await itemImageRepository.findOne({
    where: { id: imageId, itemId },
  })

  if (!itemImage) {
    throw new ItemImageNotFoundError()
  }

  await storageProvider.deleteFile(itemImage.key)
  await itemImageRepository.remove(itemImage)
}
