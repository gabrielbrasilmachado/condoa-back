import 'dotenv/config'
import path from 'node:path'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { Address } from '../../modules/address/entities/address.entity'
import { RefreshToken } from '../../modules/auth/entities/refresh-token.entity'
import { Category } from '../../modules/category/entities/category.entity'
import { Condominium } from '../../modules/condominium/entities/condominium.entity'
import { CondominiumRequest } from '../../modules/condominium-request/entities/condominium-request.entity'
import { Item } from '../../modules/item/entities/item.entity'
import { ItemImage } from '../../modules/item-image/entities/item-image.entity'
import { User } from '../../modules/user/entities/user.entity'

const parseBoolean = (value?: string, fallback = false): boolean => {
  if (!value) {
    return fallback
  }

  return value.trim().toLowerCase() === 'true'
}

const getDatabaseSslOption = (): boolean | { rejectUnauthorized: boolean } => {
  const shouldUseSsl = parseBoolean(process.env.DB_SSL, false)

  if (!shouldUseSsl) {
    return false
  }

  return {
    rejectUnauthorized: false,
  }
}

const baseOptions = {
  synchronize: false,
  logging: false,
  entities: [
    User,
    Condominium,
    CondominiumRequest,
    Address,
    Category,
    Item,
    ItemImage,
    RefreshToken,
  ],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
}

const getDataSourceOptions = (): DataSourceOptions => {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  const ssl = getDatabaseSslOption()

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl,
      ...baseOptions,
    } as DataSourceOptions
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'condoa',
    ssl,
    ...baseOptions,
  } as DataSourceOptions
}

export const AppDataSource = new DataSource(getDataSourceOptions())
