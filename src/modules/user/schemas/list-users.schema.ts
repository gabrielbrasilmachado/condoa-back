import { z } from 'zod'

const positiveIntegerSchema = z.coerce.number().int().min(1)

export const listUsersSortBySchema = z.enum(['createdAt'])
export const listUsersSortOrderSchema = z.enum(['asc', 'desc'])

export const listUsersQuerySchema = z.object({
  page: positiveIntegerSchema.default(1),
  perPage: positiveIntegerSchema.max(100).default(10),
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  condominiumId: z.uuid().optional(),
  sortBy: listUsersSortBySchema.default('createdAt'),
  sortOrder: listUsersSortOrderSchema.default('desc'),
})

export type ListUsersQueryInput = z.input<typeof listUsersQuerySchema>
export type ListUsersQueryData = z.output<typeof listUsersQuerySchema>
