import { z } from 'zod'

export const uploadItemImageSchema = z
  .object({
    isPrimary: z
      .union([z.boolean(), z.string()])
      .transform((value) => value === true || value === 'true')
      .optional()
      .default(false),
  })
  .strict()

export type UploadItemImageInput = z.input<typeof uploadItemImageSchema>
export type UploadItemImageData = z.output<typeof uploadItemImageSchema>
