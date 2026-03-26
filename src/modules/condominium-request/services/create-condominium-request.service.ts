import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../../condominium/entities/condominium.entity'
import { User } from '../../user/entities/user.entity'
import { type CondominiumRequestResponseDto } from '../dtos/condominium-request-response.dto'
import { CondominiumRequest } from '../entities/condominium-request.entity'
import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'
import { CondominiumRequestAlreadyPendingError } from '../errors/condominium-request-already-pending.error'
import { CondominiumRequestCondominiumNotFoundError } from '../errors/condominium-request-condominium-not-found.error'
import { UserAlreadyLinkedToCondominiumError } from '../errors/user-already-linked-to-condominium.error'
import { toCondominiumRequestResponseDto } from '../mappers/condominium-request-response.mapper'
import { type CreateCondominiumRequestData } from '../schemas/create-condominium-request.schema'

export const createCondominiumRequestService = async (
  authenticatedUserId: string,
  data: CreateCondominiumRequestData
): Promise<CondominiumRequestResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)
  const condominiumRepository = AppDataSource.getRepository(Condominium)
  const requestRepository = AppDataSource.getRepository(CondominiumRequest)

  const user = await userRepository.findOne({
    where: { id: authenticatedUserId },
    select: { id: true, condominiumId: true },
  })

  if (!user?.id) {
    throw new UserAlreadyLinkedToCondominiumError()
  }

  if (user.condominiumId) {
    throw new UserAlreadyLinkedToCondominiumError()
  }

  const pendingRequest = await requestRepository.findOne({
    where: {
      userId: authenticatedUserId,
      status: CondominiumRequestStatus.PENDING,
    },
  })

  if (pendingRequest) {
    throw new CondominiumRequestAlreadyPendingError()
  }

  const condominium = await condominiumRepository.findOne({
    where: { id: data.condominiumId },
    select: { id: true },
  })

  if (!condominium) {
    throw new CondominiumRequestCondominiumNotFoundError()
  }

  const request = requestRepository.create({
    userId: authenticatedUserId,
    condominiumId: data.condominiumId,
    status: CondominiumRequestStatus.PENDING,
    rejectionReason: null,
    reviewedAt: null,
    reviewedByUserId: null,
  })

  const savedRequest = await requestRepository.save(request)
  const completeRequest = await requestRepository.findOneOrFail({
    where: { id: savedRequest.id },
    relations: {
      user: true,
      condominium: true,
      reviewedBy: true,
    },
  })

  return toCondominiumRequestResponseDto(completeRequest)
}
