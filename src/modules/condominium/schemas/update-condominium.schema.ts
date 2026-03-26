import { z } from 'zod'
import { condominiumNameSchema } from './create-condominium.schema'

export const updateCondominiumSchema = z
  .object({
    name: condominiumNameSchema.optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar.',
  })

export type UpdateCondominiumInput = z.input<typeof updateCondominiumSchema>
export type UpdateCondominiumData = z.output<typeof updateCondominiumSchema>
