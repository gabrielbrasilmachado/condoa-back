import bcrypt from 'bcrypt'
import { AppDataSource } from '../../../shared/database/data-source'
import { getBcryptSaltRounds } from '../../../shared/utils/get-bcrypt-salt-rounds'
import { type UserResponseDto } from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { InvalidCurrentPasswordError } from '../errors/invalid-current-password.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { toUserResponseDto } from '../mappers/user-response.mapper'
import { type UpdateOwnProfileData } from '../schemas/update-own-profile.schema'

export const updateOwnProfileService = async (
  userId: string,
  data: UpdateOwnProfileData
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.id = :id', { id: userId })
    .getOne()

  if (!user) {
    throw new UserNotFoundError()
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await userRepository.findOne({
      where: { email: data.email },
    })

    if (existingUser && existingUser.id !== userId) {
      throw new EmailAlreadyInUseError()
    }
  }

  if (data.currentPassword && data.newPassword) {
    const passwordMatches = await bcrypt.compare(
      data.currentPassword,
      user.password
    )

    if (!passwordMatches) {
      throw new InvalidCurrentPasswordError()
    }

    user.password = await bcrypt.hash(data.newPassword, getBcryptSaltRounds())
  }

  if (data.name !== undefined) {
    user.name = data.name
  }

  if (data.email !== undefined) {
    user.email = data.email
  }

  if (data.phone !== undefined) {
    user.phone = data.phone
  }

  const updatedUser = await userRepository.save(user)

  return toUserResponseDto(updatedUser)
}
