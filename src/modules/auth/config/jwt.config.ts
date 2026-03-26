import { type SignOptions } from 'jsonwebtoken'
import { type StringValue } from 'ms'
import { AuthConfigurationError } from '../errors/auth-configuration.error'

type JwtExpiresIn = NonNullable<SignOptions['expiresIn']>

export type JwtConfig = {
  accessSecret: string
  accessExpiresIn: JwtExpiresIn
  refreshSecret: string
  refreshExpiresIn: JwtExpiresIn
  refreshCookieName: string
  refreshCookiePath: string
  refreshCookieSecure: boolean
  refreshCookieSameSite: 'lax' | 'strict' | 'none'
}

const DEFAULT_ACCESS_EXPIRES_IN: StringValue = '15m'
const DEFAULT_REFRESH_EXPIRES_IN: StringValue = '30d'
const DEFAULT_REFRESH_COOKIE_NAME = 'refreshToken'
const DEFAULT_REFRESH_COOKIE_PATH = '/auth'

const getEnvValue = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = process.env[key]?.trim()

    if (value) {
      return value
    }
  }

  return undefined
}

const parseJwtExpiresIn = (
  expiresInEnv?: string,
  fallback?: StringValue
): JwtExpiresIn => {
  if (!expiresInEnv) {
    return fallback || DEFAULT_ACCESS_EXPIRES_IN
  }

  const trimmedExpiresIn = expiresInEnv.trim()

  if (/^\d+$/.test(trimmedExpiresIn)) {
    return Number(trimmedExpiresIn)
  }

  return trimmedExpiresIn as StringValue
}

const parseBoolean = (valueEnv?: string, fallback = false): boolean => {
  if (!valueEnv) {
    return fallback
  }

  return valueEnv.trim().toLowerCase() === 'true'
}

const parseSameSite = (valueEnv?: string): 'lax' | 'strict' | 'none' => {
  const normalizedValue = valueEnv?.trim().toLowerCase()

  if (
    normalizedValue === 'lax' ||
    normalizedValue === 'strict' ||
    normalizedValue === 'none'
  ) {
    return normalizedValue
  }

  return 'lax'
}

export const getJwtConfig = (): JwtConfig => {
  const accessSecret = getEnvValue('JWT_ACCESS_SECRET', 'JWT_SECRET')
  const refreshSecret = getEnvValue('JWT_REFRESH_SECRET')

  if (!accessSecret || !refreshSecret) {
    throw new AuthConfigurationError()
  }

  return {
    accessSecret,
    accessExpiresIn: parseJwtExpiresIn(
      getEnvValue('JWT_ACCESS_EXPIRES_IN', 'JWT_EXPIRES_IN'),
      DEFAULT_ACCESS_EXPIRES_IN
    ),
    refreshSecret,
    refreshExpiresIn: parseJwtExpiresIn(
      getEnvValue('JWT_REFRESH_EXPIRES_IN'),
      DEFAULT_REFRESH_EXPIRES_IN
    ),
    refreshCookieName:
      getEnvValue('JWT_REFRESH_COOKIE_NAME') || DEFAULT_REFRESH_COOKIE_NAME,
    refreshCookiePath:
      getEnvValue('JWT_REFRESH_COOKIE_PATH') || DEFAULT_REFRESH_COOKIE_PATH,
    refreshCookieSecure: parseBoolean(
      getEnvValue('JWT_REFRESH_COOKIE_SECURE'),
      false
    ),
    refreshCookieSameSite: parseSameSite(
      getEnvValue('JWT_REFRESH_COOKIE_SAME_SITE')
    ),
  }
}
