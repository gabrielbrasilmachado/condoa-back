import { z } from 'zod'
import { UserRole } from '../enums/user-role.enum'
import { userPhoneSchema } from './create-user.schema'

const adminUpdateUserShape = {
  name: z
    .string({ error: 'Nome deve ser um texto.' })
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres.')
    .max(255, 'Nome deve ter no máximo 255 caracteres.')
    .optional(),
  email: z.email('Formato de e-mail inválido.').trim().toLowerCase().optional(),
  phone: userPhoneSchema.optional(),
  role: z
    .enum([UserRole.ADMIN, UserRole.USER], {
      error: 'Role deve ser um valor válido.',
    })
    .optional(),
  condominiumId: z.union([z.uuid(), z.null()]).optional(),
} satisfies z.ZodRawShape

export const adminUpdateUserSchema = z
  .object(adminUpdateUserShape)
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  })

export type AdminUpdateUserInput = z.input<typeof adminUpdateUserSchema>
export type AdminUpdateUserData = z.output<typeof adminUpdateUserSchema>
