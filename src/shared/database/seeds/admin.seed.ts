import 'dotenv/config'
import 'reflect-metadata'
import bcrypt from 'bcrypt'
import { AppDataSource } from '../data-source'
import { User } from '../../../modules/user/entities/user.entity'
import { UserRole } from '../../../modules/user/enums/user-role.enum'
import { UserStatus } from '../../../modules/user/enums/user-status.enum'

const DEFAULT_BCRYPT_SALT_ROUNDS = 10

type AdminEnv = {
  name: string
  email: string
  phone: string
  password: string
}

const getAdminEnv = (): AdminEnv => {
  const name = process.env.ADMIN_NAME?.trim()
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const phone = process.env.ADMIN_PHONE?.trim() || '(11) 99999-9999'
  const password = process.env.ADMIN_PASSWORD?.trim()

  if (!name) {
    throw new Error('ADMIN_NAME é obrigatório para executar o seed do admin.')
  }

  if (!email) {
    throw new Error('ADMIN_EMAIL é obrigatório para executar o seed do admin.')
  }

  if (!password) {
    throw new Error(
      'ADMIN_PASSWORD é obrigatório para executar o seed do admin.'
    )
  }

  return {
    name,
    email,
    phone,
    password,
  }
}

const getBcryptSaltRounds = (): number => {
  const saltRoundsEnv = process.env.BCRYPT_SALT_ROUNDS?.trim()

  if (!saltRoundsEnv) {
    return DEFAULT_BCRYPT_SALT_ROUNDS
  }

  const saltRounds = Number(saltRoundsEnv)

  if (!Number.isInteger(saltRounds) || saltRounds <= 0) {
    throw new Error('BCRYPT_SALT_ROUNDS deve ser um inteiro positivo.')
  }

  return saltRounds
}

const seedAdminUser = async (): Promise<void> => {
  try {
    const adminEnv = getAdminEnv()
    const bcryptSaltRounds = getBcryptSaltRounds()

    await AppDataSource.initialize()

    const userRepository = AppDataSource.getRepository(User)
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEnv.email },
    })

    if (existingAdmin) {
      console.info(
        `Usuário administrador com e-mail "${adminEnv.email}" já existe. Seed ignorado.`
      )
      return
    }

    const hashedPassword = await bcrypt.hash(
      adminEnv.password,
      bcryptSaltRounds
    )

    const adminUser = userRepository.create({
      name: adminEnv.name,
      email: adminEnv.email,
      phone: adminEnv.phone,
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    })

    await userRepository.save(adminUser)

    console.info(
      `Usuário administrador "${adminEnv.email}" criado com sucesso.`
    )
  } catch (error: unknown) {
    console.error('Falha ao executar o seed do usuário administrador.', error)
    process.exit(1)
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  }
}

void seedAdminUser()
