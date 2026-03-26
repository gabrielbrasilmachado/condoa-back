import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Formato de e-mail inválido.').trim().toLowerCase(),
  password: z
    .string({
      error: 'Senha deve ser um texto.',
    })
    .trim()
    .min(1, 'Senha é obrigatória.'),
})
