import { createHash } from 'node:crypto'

export const buildTokenHash = (token: string): string =>
  createHash('sha256').update(token).digest('hex')
