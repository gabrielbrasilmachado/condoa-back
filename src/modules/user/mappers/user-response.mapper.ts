import {
  type UserListItemDto,
  type UserResponseDto,
} from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'

export const toUserResponseDto = (user: User): UserResponseDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  condominium_id: user.condominiumId,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
})

export const toUserListItemDto = (user: User): UserListItemDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  condominium: user.condominium
    ? {
        id: user.condominium.id,
        name: user.condominium.name,
      }
    : null,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
})
