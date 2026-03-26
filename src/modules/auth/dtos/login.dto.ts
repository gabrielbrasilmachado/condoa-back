import { z } from 'zod'
import { type UserResponseDto } from '../../user/dtos/user-response.dto'
import { loginSchema } from '../schemas/login.schema'

export type LoginRequestDto = z.infer<typeof loginSchema>

export type LoginResponseDto = {
  accessToken: string
  expiresIn: number
  user: UserResponseDto
}

export type RefreshTokenResponseDto = {
  accessToken: string
  expiresIn: number
}
