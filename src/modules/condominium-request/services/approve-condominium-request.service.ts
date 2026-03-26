import { AppDataSource } from '../../../shared/database/data-source'
import { User } from '../../user/entities/user.entity'
import { type CondominiumRequestResponseDto } from '../dtos/condominium-request-response.dto'
import { CondominiumRequest } from '../entities/condominium-request.entity'
import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'
import { CondominiumRequestAlreadyReviewedError } from '../errors/condominium-request-already-reviewed.error'
import { CondominiumRequestApprovalConflictError } from '../errors/condominium-request-approval-conflict.error'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import { toCondominiumRequestResponseDto } from '../mappers/condominium-request-response.mapper'

export const approveCondominiumRequestService = async (
  requestId: string,
  reviewedByUserId: string
): Promise<CondominiumRequestResponseDto> => {
  const updatedRequestId = await AppDataSource.transaction(async (manager) => {
    const requestRepository = manager.getRepository(CondominiumRequest)
    const userRepository = manager.getRepository(User)

    const request = await requestRepository.findOne({
      where: { id: requestId },
      relations: {
        user: true,
      },
    })

    if (!request) {
      throw new CondominiumRequestNotFoundError()
    }

    if (request.status !== CondominiumRequestStatus.PENDING) {
      throw new CondominiumRequestAlreadyReviewedError(request.status)
    }

    if (request.user.condominiumId) {
      throw new CondominiumRequestApprovalConflictError()
    }

    request.user.condominiumId = request.condominiumId
    await userRepository.save(request.user)

    request.status = CondominiumRequestStatus.APPROVED
    request.reviewedAt = new Date()
    request.reviewedByUserId = reviewedByUserId
    request.rejectionReason = null

    await requestRepository.save(request)

    return request.id
  })

  const repository = AppDataSource.getRepository(CondominiumRequest)
  const completeRequest = await repository.findOneOrFail({
    where: { id: updatedRequestId },
    relations: {
      user: true,
      condominium: true,
      reviewedBy: true,
    },
  })

  return toCondominiumRequestResponseDto(completeRequest)
}
