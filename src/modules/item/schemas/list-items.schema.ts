import { z } from 'zod'
import { ItemStatus } from '../enums/item-status.enum'

const positiveIntegerSchema = z.coerce.number().int().min(1)

export const listItemsSortBySchema = z.enum(['createdAt'])
export const listItemsSortOrderSchema = z.enum(['asc', 'desc'])
export const itemStatusFilterSchema = z.enum([
  ItemStatus.AVAILABLE,
  ItemStatus.DONATED,
  ItemStatus.EXPIRED,
])

export const listItemsQuerySchema = z.object({
  page: positiveIntegerSchema.default(1),
  perPage: positiveIntegerSchema.max(100).default(10),
  categoryId: z.uuid().optional(),
  status: itemStatusFilterSchema.optional(),
  sortBy: listItemsSortBySchema.default('createdAt'),
  sortOrder: listItemsSortOrderSchema.default('desc'),
})

export type ListItemsQueryInput = z.input<typeof listItemsQuerySchema>
export type ListItemsQueryData = z.output<typeof listItemsQuerySchema>
