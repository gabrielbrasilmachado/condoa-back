import { z } from 'zod'

export const rejectCondominiumRequestSchema = z
  .object({
    rejectionReason: z
      .string({ error: 'Motivo da rejeição deve ser um texto.' })
      .trim()
      .min(1, 'Motivo da rejeição não pode ser vazio.')
      .max(1000, 'Motivo da rejeição deve ter no máximo 1000 caracteres.')
      .optional(),
  })
  .strict()

export type RejectCondominiumRequestInput = z.input<
  typeof rejectCondominiumRequestSchema
>
export type RejectCondominiumRequestData = z.output<
  typeof rejectCondominiumRequestSchema
>
