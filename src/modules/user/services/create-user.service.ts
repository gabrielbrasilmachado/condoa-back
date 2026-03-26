import bcrypt from 'bcrypt'
import { AppDataSource } from '../../../shared/database/data-source'
import { getBcryptSaltRounds } from '../../../shared/utils/get-bcrypt-salt-rounds'
import { type UserResponseDto } from '../dtos/user-response.dto'
import { User } from '../entities/user.entity'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use.error'
import { UserStatus } from '../enums/user-status.enum'
import { toUserResponseDto } from '../mappers/user-response.mapper'
import {
  DEFAULT_CREATED_USER_ROLE,
  type CreateUserData,
} from '../schemas/create-user.schema'

export const createUserService = async (
  data: CreateUserData
): Promise<UserResponseDto> => {
  const userRepository = AppDataSource.getRepository(User)

  const existingUser = await userRepository.findOne({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new EmailAlreadyInUseError()
  }

  const hashedPassword = await bcrypt.hash(data.password, getBcryptSaltRounds())

  const user = userRepository.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    role: DEFAULT_CREATED_USER_ROLE,
    status: UserStatus.ACTIVE,
    condominiumId: null,
  })

  const savedUser = await userRepository.save(user)

  return toUserResponseDto(savedUser)
}
