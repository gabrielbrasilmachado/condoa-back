import { StorageConfigurationError } from '../errors/storage-configuration.error'

export type StorageProviderName = 'minio' | 'supabase'

export type StorageConfig = {
  provider: StorageProviderName
  minio: {
    host: string
    port: number
    useSSL: boolean
    publicUrl: string
    accessKey: string
    secretKey: string
    bucket: string
  }
  supabase: {
    url: string
    serviceRoleKey: string
    bucket: string
  }
}

const DEFAULT_STORAGE_PROVIDER: StorageProviderName = 'minio'

const getEnvValue = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = process.env[key]?.trim()

    if (value) {
      return value
    }
  }

  return undefined
}

const parseStorageProvider = (providerEnv?: string): StorageProviderName => {
  if (!providerEnv) {
    return DEFAULT_STORAGE_PROVIDER
  }

  if (providerEnv === 'minio' || providerEnv === 'supabase') {
    return providerEnv
  }

  throw new StorageConfigurationError()
}

const parsePort = (portEnv?: string): number => {
  if (!portEnv) {
    throw new StorageConfigurationError()
  }

  const port = Number(portEnv)

  if (!Number.isInteger(port) || port <= 0) {
    throw new StorageConfigurationError()
  }

  return port
}

const parseBoolean = (valueEnv?: string): boolean => {
  if (!valueEnv) {
    throw new StorageConfigurationError()
  }

  const normalizedValue = valueEnv.toLowerCase()

  if (normalizedValue === 'true') {
    return true
  }

  if (normalizedValue === 'false') {
    return false
  }

  throw new StorageConfigurationError()
}

const parseUrl = (valueEnv?: string): string => {
  if (!valueEnv) {
    throw new StorageConfigurationError()
  }

  try {
    const url = new URL(valueEnv)

    return url.toString().replace(/\/+$/, '')
  } catch {
    throw new StorageConfigurationError()
  }
}

const getRequiredEnvValue = (...keys: string[]): string => {
  const value = getEnvValue(...keys)

  if (!value) {
    throw new StorageConfigurationError()
  }

  return value
}

export const getStorageConfig = (): StorageConfig => {
  const provider = parseStorageProvider(getEnvValue('STORAGE_PROVIDER'))

  return {
    provider,
    minio: {
      host: getRequiredEnvValue('MINIO_HOST'),
      port: parsePort(getRequiredEnvValue('MINIO_PORT')),
      useSSL: parseBoolean(getRequiredEnvValue('MINIO_USE_SSL')),
      publicUrl: parseUrl(getRequiredEnvValue('MINIO_PUBLIC_URL')),
      accessKey: getRequiredEnvValue('MINIO_USERNAME'),
      secretKey: getRequiredEnvValue('MINIO_PASSWORD'),
      bucket: getRequiredEnvValue('MINIO_BUCKET'),
    },
    supabase: {
      url: parseUrl(getRequiredEnvValue('SUPABASE_URL')),
      serviceRoleKey: getRequiredEnvValue('SUPABASE_SERVICE_ROLE_KEY'),
      bucket: getRequiredEnvValue('SUPABASE_STORAGE_BUCKET'),
    },
  }
}
