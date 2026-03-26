import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'
import { type CondominiumRequestResponseDto } from './condominium-request-response.dto'

export type ListCondominiumRequestsSortBy = 'createdAt'
export type ListCondominiumRequestsSortOrder = 'asc' | 'desc'

export type ListCondominiumRequestsQueryDto = {
  page: number
  perPage: number
  status?: CondominiumRequestStatus
  userId?: string
  condominiumId?: string
  sortBy: ListCondominiumRequestsSortBy
  sortOrder: ListCondominiumRequestsSortOrder
}

export type ListOwnCondominiumRequestsQueryDto = {
  page: number
  perPage: number
  status?: CondominiumRequestStatus
  sortBy: ListCondominiumRequestsSortBy
  sortOrder: ListCondominiumRequestsSortOrder
}

export type ListCondominiumRequestsResponseDto = {
  data: CondominiumRequestResponseDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
  filters: {
    status?: CondominiumRequestStatus
    userId?: string
    condominiumId?: string
  }
  sort: {
    sortBy: ListCondominiumRequestsSortBy
    sortOrder: ListCondominiumRequestsSortOrder
  }
}
