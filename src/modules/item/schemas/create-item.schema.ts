import { z } from 'zod'
import { ItemStatus } from '../enums/item-status.enum'

export const itemNameSchema = z
  .string({ error: 'Nome deve ser um texto.' })
  .trim()
  .min(2, 'Nome deve ter pelo menos 2 caracteres.')
  .max(255, 'Nome deve ter no máximo 255 caracteres.')

export const itemDescriptionSchema = z
  .string({ error: 'Descrição deve ser um texto.' })
  .trim()
  .min(2, 'Descrição deve ter pelo menos 2 caracteres.')

export const itemCategoryIdSchema = z.uuid(
  'CategoryId deve ser um UUID válido.'
)
export const itemUserIdSchema = z.uuid('UserId deve ser um UUID válido.')

export const itemExpiredAtSchema = z
  .union([z.iso.datetime(), z.date()])
  .transform((value) => new Date(value))
  .nullable()
  .optional()

export const createItemSchema = z
  .object({
    name: itemNameSchema,
    description: itemDescriptionSchema,
    categoryId: itemCategoryIdSchema,
    userId: itemUserIdSchema.optional(),
    expiredAt: itemExpiredAtSchema,
  })
  .strict()

export const updateItemStatusSchema = z.enum(
  [ItemStatus.AVAILABLE, ItemStatus.DONATED, ItemStatus.EXPIRED],
  {
    error: 'Status deve ser um valor válido.',
  }
)

export type CreateItemInput = z.input<typeof createItemSchema>
export type CreateItemData = z.output<typeof createItemSchema>
