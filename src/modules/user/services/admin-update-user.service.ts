import { AppDataSource } from '../../../shared/database/data-source'
import { Condominium } from '../../condominium/entities/condominium.entity'
import { type UserResponseDto } from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { UserCondominiumNotFoundError } from '../errors/user-condominium-not-found.error'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { toUserResponseDto } from '../mappers/user-response.mapper'
import { type AdminUpdateUserData } from '../schemas/admin-update-user.schema'

export const adminUpdateUserService = async (
  userId: string,
  data: AdminUpdateUserData
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)
  const condominiumRepository = AppDataSource.getRepository(Condominium)

  const user = await userRepository.findOne({
    where: { id: userId },
  })

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

  if (data.condominiumId !== undefined) {
    if (data.condominiumId === null) {
      user.condominiumId = null
    } else {
      const condominium = await condominiumRepository.findOne({
        where: { id: data.condominiumId },
      })

      if (!condominium) {
        throw new UserCondominiumNotFoundError()
      }

      user.condominiumId = condominium.id
    }
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

  if (data.role !== undefined) {
    user.role = data.role
  }

  const updatedUser = await userRepository.save(user)

  return toUserResponseDto(updatedUser)
}
