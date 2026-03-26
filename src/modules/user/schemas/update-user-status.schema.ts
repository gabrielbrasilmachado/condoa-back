import { z } from 'zod'
import { userStatusSchema } from './create-user.schema'

export const updateUserStatusSchema = z
  .object({
    status: userStatusSchema,
  })
  .strict()

export type UpdateUserStatusInput = z.input<typeof updateUserStatusSchema>
export type UpdateUserStatusData = z.output<typeof updateUserStatusSchema>
