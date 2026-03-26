import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'

export type CondominiumRequestUserDto = {
  id: string
  name: string
  email: string
}

export type CondominiumRequestCondominiumDto = {
  id: string
  name: string
}

export type CondominiumRequestReviewerDto = {
  id: string
  name: string
} | null

export type CondominiumRequestResponseDto = {
  id: string
  status: CondominiumRequestStatus
  rejectionReason: string | null
  reviewedAt: Date | null
  created_at: Date
  updated_at: Date
  user: CondominiumRequestUserDto
  condominium: CondominiumRequestCondominiumDto
  reviewed_by: CondominiumRequestReviewerDto
}
