import { Readable } from 'node:stream'
import { StorageUploadResult } from '../types/storage-upload-result'

export type StorageUploadInput = {
  key: string
  body: Buffer | Readable
  contentType?: string
  size?: number
}

/**
 * Contrato base para providers de storage.
 * Novos providers futuros devem manter esta mesma interface
 * para que os módulos de domínio não precisem conhecer detalhes
 * de MinIO, S3, Supabase ou qualquer outro serviço.
 */
export interface StorageProvider {
  uploadFile(input: StorageUploadInput): Promise<StorageUploadResult>
  deleteFile(key: string): Promise<void>
  getPublicUrl(key: string): string
}
