import { type CondominiumRequestResponseDto } from '../dtos/condominium-request-response.dto'
import { CondominiumRequest } from '../entities/condominium-request.entity'

export const toCondominiumRequestResponseDto = (
  request: CondominiumRequest
): CondominiumRequestResponseDto => ({
  id: request.id,
  status: request.status,
  rejectionReason: request.rejectionReason,
  reviewedAt: request.reviewedAt,
  created_at: request.createdAt,
  updated_at: request.updatedAt,
  user: {
    id: request.user.id,
    name: request.user.name,
    email: request.user.email,
  },
  condominium: {
    id: request.condominium.id,
    name: request.condominium.name,
  },
  reviewed_by: request.reviewedBy
    ? {
        id: request.reviewedBy.id,
        name: request.reviewedBy.name,
      }
    : null,
})
