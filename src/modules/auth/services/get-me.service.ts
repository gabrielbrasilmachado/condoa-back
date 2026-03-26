import { AppDataSource } from '../../../shared/database/data-source'
import { type UserResponseDto } from '../../user/dtos/user-response.dto'
import { User } from '../../user/entities/user.entity'
import { UserNotFoundError } from '../../user/errors/user-not-found.error'
import { toUserResponseDto } from '../../user/mappers/user-response.mapper'

export const getMeService = async (
  userId: string
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOne({
    where: { id: userId },
  })

  if (!user) {
    throw new UserNotFoundError()
  }

  return toUserResponseDto(user)
}
