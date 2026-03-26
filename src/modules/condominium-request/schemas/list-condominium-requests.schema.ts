import { z } from 'zod'
import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'

const positiveIntegerSchema = z.coerce.number().int().min(1)

export const condominiumRequestStatusSchema = z.enum([
  CondominiumRequestStatus.PENDING,
  CondominiumRequestStatus.APPROVED,
  CondominiumRequestStatus.REJECTED,
])

export const listCondominiumRequestsSortBySchema = z.enum(['createdAt'])
export const listCondominiumRequestsSortOrderSchema = z.enum(['asc', 'desc'])

export const listCondominiumRequestsQuerySchema = z.object({
  page: positiveIntegerSchema.default(1),
  perPage: positiveIntegerSchema.max(100).default(10),
  status: condominiumRequestStatusSchema.optional(),
  userId: z.uuid().optional(),
  condominiumId: z.uuid().optional(),
  sortBy: listCondominiumRequestsSortBySchema.default('createdAt'),
  sortOrder: listCondominiumRequestsSortOrderSchema.default('desc'),
})

export const listOwnCondominiumRequestsQuerySchema = z.object({
  page: positiveIntegerSchema.default(1),
  perPage: positiveIntegerSchema.max(100).default(10),
  status: condominiumRequestStatusSchema.optional(),
  sortBy: listCondominiumRequestsSortBySchema.default('createdAt'),
  sortOrder: listCondominiumRequestsSortOrderSchema.default('desc'),
})

export type ListCondominiumRequestsQueryInput = z.input<
  typeof listCondominiumRequestsQuerySchema
>
export type ListCondominiumRequestsQueryData = z.output<
  typeof listCondominiumRequestsQuerySchema
>
export type ListOwnCondominiumRequestsQueryInput = z.input<
  typeof listOwnCondominiumRequestsQuerySchema
>
export type ListOwnCondominiumRequestsQueryData = z.output<
  typeof listOwnCondominiumRequestsQuerySchema
>
