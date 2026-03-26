import { ItemStatus } from '../enums/item-status.enum'

export type ItemListSortBy = 'createdAt'
export type ItemListSortOrder = 'asc' | 'desc'

export type ListItemsQueryDto = {
  page: number
  perPage: number
  categoryId?: string
  status?: ItemStatus
  sortBy: ItemListSortBy
  sortOrder: ItemListSortOrder
}

export type ItemListCategoryDto = {
  id: string
  name: string
}

export type ItemListUserDto = {
  id: string
  name: string
}

export type ItemListImageDto = {
  id: string
  url: string
  is_primary: boolean
  created_at: Date
}

export type ItemListItemDto = {
  id: string
  name: string
  description: string
  status: ItemStatus
  expired_at: Date | null
  created_at: Date
  updated_at: Date
  category: ItemListCategoryDto
  images: ItemListImageDto[]
  user: ItemListUserDto
}

export type ListItemsResponseDto = {
  data: ItemListItemDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
  filters: {
    categoryId?: string
    status?: ItemStatus
  }
  sort: {
    sortBy: ItemListSortBy
    sortOrder: ItemListSortOrder
  }
}
