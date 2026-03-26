import { z } from 'zod'

export const condominiumNameSchema = z
  .string({ error: 'Nome deve ser um texto.' })
  .trim()
  .min(2, 'Nome deve ter pelo menos 2 caracteres.')
  .max(255, 'Nome deve ter no máximo 255 caracteres.')

export const createCondominiumSchema = z
  .object({
    name: condominiumNameSchema,
  })
  .strict()

export type CreateCondominiumInput = z.input<typeof createCondominiumSchema>
export type CreateCondominiumData = z.output<typeof createCondominiumSchema>
