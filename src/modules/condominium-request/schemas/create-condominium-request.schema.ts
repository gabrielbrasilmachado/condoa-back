import { z } from 'zod'

export const createCondominiumRequestSchema = z
  .object({
    condominiumId: z.uuid(),
  })
  .strict()

export type CreateCondominiumRequestInput = z.input<
  typeof createCondominiumRequestSchema
>
export type CreateCondominiumRequestData = z.output<
  typeof createCondominiumRequestSchema
>
