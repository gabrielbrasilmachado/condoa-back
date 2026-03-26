import { z } from 'zod'
import { userPhoneSchema } from './create-user.schema'

const passwordSchema = z
  .string({ error: 'Senha deve ser um texto.' })
  .trim()
  .min(8, 'Senha deve ter pelo menos 8 caracteres.')
  .max(255, 'Senha deve ter no máximo 255 caracteres.')

const updateOwnProfileShape = {
  name: z
    .string({ error: 'Nome deve ser um texto.' })
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres.')
    .max(255, 'Nome deve ter no máximo 255 caracteres.')
    .optional(),
  email: z.email('Formato de e-mail inválido.').trim().toLowerCase().optional(),
  phone: userPhoneSchema.optional(),
  currentPassword: passwordSchema.optional(),
  newPassword: passwordSchema.optional(),
} satisfies z.ZodRawShape

export const updateOwnProfileSchema = z
  .object(updateOwnProfileShape)
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  })
  .refine(
    (data) => {
      const isUpdatingPassword =
        data.currentPassword !== undefined || data.newPassword !== undefined

      if (!isUpdatingPassword) {
        return true
      }

      return !!data.currentPassword && !!data.newPassword
    },
    {
      message: 'Para alterar a senha, informe a senha atual e a nova senha.',
      path: ['currentPassword'],
    }
  )

export type UpdateOwnProfileInput = z.input<typeof updateOwnProfileSchema>
export type UpdateOwnProfileData = z.output<typeof updateOwnProfileSchema>
