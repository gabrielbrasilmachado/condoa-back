import { type UserListItemDto } from './user-response.dto'

export type ListUsersSortBy = 'createdAt'
export type ListUsersSortOrder = 'asc' | 'desc'

export type ListUsersQueryDto = {
  page: number
  perPage: number
  name?: string
  email?: string
  condominiumId?: string
  sortBy: ListUsersSortBy
  sortOrder: ListUsersSortOrder
}

export type ListedUserDto = UserListItemDto

export type ListUsersResponseDto = {
  data: ListedUserDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
  filters: {
    name?: string
    email?: string
    condominiumId?: string
  }
  sort: {
    sortBy: ListUsersSortBy
    sortOrder: ListUsersSortOrder
  }
}
