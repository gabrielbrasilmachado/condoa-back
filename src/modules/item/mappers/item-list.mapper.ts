import { type ItemListItemDto } from '../dtos/list-items.dto'
import { Item } from '../entities/item.entity'

export const toItemListItemDto = (item: Item): ItemListItemDto => ({
  id: item.id,
  name: item.name,
  description: item.description,
  status: item.status,
  expired_at: item.expiredAt,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
  category: {
    id: item.category.id,
    name: item.category.name,
  },
  images: item.images.map((image) => ({
    id: image.id,
    url: image.url,
    is_primary: image.isPrimary,
    created_at: image.createdAt,
  })),
  user: {
    id: item.user.id,
    name: item.user.name,
  },
})
