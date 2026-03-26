import { UserRole } from '../enums/user-role.enum'
import { UserStatus } from '../enums/user-status.enum'

export type UserResponseDto = {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  condominium_id: string | null
  created_at: Date
  updated_at: Date
}

export type UserListCondominiumDto = {
  id: string
  name: string
}

export type UserListItemDto = Omit<UserResponseDto, 'condominium_id'> & {
  condominium: UserListCondominiumDto | null
}
