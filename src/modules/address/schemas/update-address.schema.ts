import { z } from 'zod'
import { createAddressSchema } from './create-address.schema'

export const updateAddressSchema = createAddressSchema
  .partial()
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar.',
  })

export type UpdateAddressInput = z.input<typeof updateAddressSchema>
export type UpdateAddressData = z.output<typeof updateAddressSchema>
