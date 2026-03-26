import { ItemStatus } from '../enums/item-status.enum'

export type ItemAnalyticsStatusDto = Record<ItemStatus, number>

export type ItemAnalyticsCategoryDto = {
  id: string
  name: string
  count: number
}

export type ItemAnalyticsResponseDto = {
  status: ItemAnalyticsStatusDto
  categories: ItemAnalyticsCategoryDto[]
}
