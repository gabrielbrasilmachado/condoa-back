const DEFAULT_BCRYPT_SALT_ROUNDS = 10

export const getBcryptSaltRounds = (): number => {
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
