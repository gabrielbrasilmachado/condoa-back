import { z } from 'zod'

export const createCategorySchema = z
  .object({
    name: z
      .string({
        error: 'Nome deve ser um texto.',
      })
      .trim()
      .min(2, 'Nome deve ter pelo menos 2 caracteres.')
      .max(255, 'Nome deve ter no máximo 255 caracteres.')
      .transform((value) => value.toUpperCase()),
  })
  .strict()

export type CreateCategoryInput = z.input<typeof createCategorySchema>
export type CreateCategoryData = z.output<typeof createCategorySchema>
