import { z } from 'zod'
import {
  itemCategoryIdSchema,
  itemDescriptionSchema,
  itemExpiredAtSchema,
  itemNameSchema,
  updateItemStatusSchema,
} from './create-item.schema'

export const updateItemSchema = z
  .object({
    name: itemNameSchema.optional(),
    description: itemDescriptionSchema.optional(),
    categoryId: itemCategoryIdSchema.optional(),
    status: updateItemStatusSchema.optional(),
    expiredAt: itemExpiredAtSchema,
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar.',
  })

export type UpdateItemInput = z.input<typeof updateItemSchema>
export type UpdateItemData = z.output<typeof updateItemSchema>
