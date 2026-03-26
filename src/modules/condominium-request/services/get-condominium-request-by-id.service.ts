import { AppDataSource } from '../../../shared/database/data-source'
import { type CondominiumRequestResponseDto } from '../dtos/condominium-request-response.dto'
import { CondominiumRequest } from '../entities/condominium-request.entity'
import { CondominiumRequestNotFoundError } from '../errors/condominium-request-not-found.error'
import { toCondominiumRequestResponseDto } from '../mappers/condominium-request-response.mapper'

export const getCondominiumRequestByIdService = async (
  requestId: string
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

  return toCondominiumRequestResponseDto(request)
}
