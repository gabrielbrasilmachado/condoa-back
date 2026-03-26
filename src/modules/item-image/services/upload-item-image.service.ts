import { AppDataSource } from '../../../shared/database/data-source'
import {
  buildProductImageStorageKey,
  storageConfig,
  storageProvider,
} from '../../../shared/storage'
import { type AuthenticatedUser } from '../../auth/types/authenticated-user.type'
import { UserRole } from '../../user/enums/user-role.enum'
import { Item } from '../../item/entities/item.entity'
import { ItemAccessForbiddenError } from '../../item/errors/item-access-forbidden.error'
import { ItemNotFoundError } from '../../item/errors/item-not-found.error'
import { ItemImage } from '../entities/item-image.entity'
import { ItemImageLimitReachedError } from '../errors/item-image-limit-reached.error'
import { type UploadItemImageData } from '../schemas/upload-item-image.schema'

export const uploadItemImageService = async (
  authenticatedUser: AuthenticatedUser,
  itemId: string,
  file: Express.Multer.File,
  data: UploadItemImageData
): Promise<ItemImage> => {
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

  const key = buildProductImageStorageKey(itemId, file.originalname)
  const upload = await storageProvider.uploadFile({
    key,
    body: file.buffer,
    contentType: file.mimetype,
    size: file.size,
  })

  try {
    return await AppDataSource.transaction(async (manager) => {
      const itemImageRepository = manager.getRepository(ItemImage)
      const existingImagesCount = await itemImageRepository.count({
        where: { itemId },
      })

      if (existingImagesCount >= 3) {
        throw new ItemImageLimitReachedError()
      }

      const shouldBePrimary =
        existingImagesCount === 0 || data.isPrimary === true

      if (shouldBePrimary) {
        await itemImageRepository.update(
          { itemId, isPrimary: true },
          { isPrimary: false }
        )
      }

      const itemImage = itemImageRepository.create({
        itemId,
        provider: storageConfig.provider,
        bucket: upload.bucket,
        key: upload.key,
        url: upload.url,
        mimeType: file.mimetype,
        size: file.size,
        originalName: file.originalname,
        isPrimary: shouldBePrimary,
      })

      return itemImageRepository.save(itemImage)
    })
  } catch (error: unknown) {
    try {
      await storageProvider.deleteFile(upload.key)
    } catch (cleanupError: unknown) {
      console.error(
        'Falha ao limpar arquivo enviado após erro ao persistir imagem do item.',
        cleanupError
      )
    }

    throw error
  }
}
