import { z } from 'zod'

export const refreshTokenSchema = z.object({}).strict()

export type RefreshTokenInput = z.input<typeof refreshTokenSchema>
