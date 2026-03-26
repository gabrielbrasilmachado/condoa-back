import { AppDataSource } from '../../../shared/database/data-source'
import { type CondominiumRequestResponseDto } from '../dtos/condominium-request-response.dto'
import { CondominiumRequest } from '../entities/condominium-request.entity'
import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'
import { CondominiumRequestAlreadyReviewedError } from '../errors/condominium-request-already-reviewed.error'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import { toCondominiumRequestResponseDto } from '../mappers/condominium-request-response.mapper'
import { type RejectCondominiumRequestData } from '../schemas/reject-condominium-request.schema'

export const rejectCondominiumRequestService = async (
  requestId: string,
  reviewedByUserId: string,
  data: RejectCondominiumRequestData
): Promise<CondominiumRequestResponseDto> => {
  const repository = AppDataSource.getRepository(CondominiumRequest)
  const request = await repository.findOne({
    where: { id: requestId },
    relations: {
      user: true,
      condominium: true,
      reviewedBy: true,
    },
  })

  if (!request) {
    throw new CondominiumRequestNotFoundError()
  }

  if (request.status !== CondominiumRequestStatus.PENDING) {
    throw new CondominiumRequestAlreadyReviewedError(request.status)
  }

  request.status = CondominiumRequestStatus.REJECTED
  request.reviewedAt = new Date()
  request.reviewedByUserId = reviewedByUserId
  request.rejectionReason = data.rejectionReason ?? null

  const updatedRequest = await repository.save(request)
  const completeRequest = await repository.findOneOrFail({
    where: { id: updatedRequest.id },
    relations: {
      user: true,
      condominium: true,
      reviewedBy: true,
    },
  })

  return toCondominiumRequestResponseDto(completeRequest)
}
