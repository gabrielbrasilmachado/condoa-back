import { z } from 'zod'
import { UserRole } from '../enums/user-role.enum'
import { UserStatus } from '../enums/user-status.enum'

export const userStatusSchema = z.enum(
  [UserStatus.ACTIVE, UserStatus.INACTIVE],
  {
    error: 'Status deve ser um valor válido.',
  }
)

export const DEFAULT_CREATED_USER_ROLE = UserRole.USER

export const userPhoneSchema = z
  .string({ error: 'Telefone deve ser um texto.' })
  .trim()
  .regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
    error: 'Telefone deve estar no formato (11) 11111-1111.',
  })

export const createUserSchema = z
  .object({
    name: z
      .string({ error: 'Nome deve ser um texto.' })
      .trim()
      .min(2, 'Nome deve ter pelo menos 2 caracteres.')
      .max(255, 'Nome deve ter no máximo 255 caracteres.'),
    email: z.email('Formato de e-mail inválido.').trim().toLowerCase(),
    phone: userPhoneSchema,
    password: z
      .string({ error: 'Senha deve ser um texto.' })
      .trim()
      .min(8, 'Senha deve ter pelo menos 8 caracteres.')
      .max(255, 'Senha deve ter no máximo 255 caracteres.'),
  })
  .strict()

export type CreateUserInput = z.input<typeof createUserSchema>
export type CreateUserData = z.output<typeof createUserSchema>
