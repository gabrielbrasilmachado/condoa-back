import { randomUUID } from 'node:crypto'
import path from 'node:path'

const sanitizeFilename = (filename: string): string => {
  const normalizedFilename = path.basename(filename).trim().toLowerCase()

  return normalizedFilename.replaceAll(/[^a-z0-9.-]+/g, '-')
}

const buildUniqueFileName = (filename: string): string =>
  `${randomUUID()}-${sanitizeFilename(filename)}`

export const buildProductImageStorageKey = (
  itemId: string,
  filename: string
): string => `items/${itemId}/images/${buildUniqueFileName(filename)}`
