import { AppDataSource } from '../../../shared/database/data-source'
import { type UserResponseDto } from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { toUserResponseDto } from '../mappers/user-response.mapper'
import { type UpdateUserStatusData } from '../schemas/update-user-status.schema'

export const updateUserStatusService = async (
  userId: string,
  data: UpdateUserStatusData
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOne({
    where: { id: userId },
  })

  if (!user) {
    throw new UserNotFoundError()
  }

  user.status = data.status

  const updatedUser = await userRepository.save(user)

  return toUserResponseDto(updatedUser)
}
