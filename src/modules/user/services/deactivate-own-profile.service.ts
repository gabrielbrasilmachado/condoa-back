import { AppDataSource } from '../../../shared/database/data-source'
import { type UserResponseDto } from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { UserStatus } from '../enums/user-status.enum'
import { toUserResponseDto } from '../mappers/user-response.mapper'

export const deactivateOwnProfileService = async (
  userId: string
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOne({
    where: { id: userId },
  })

  if (!user) {
    throw new UserNotFoundError()
  }

  user.status = UserStatus.INACTIVE

  const updatedUser = await userRepository.save(user)

  return toUserResponseDto(updatedUser)
}
