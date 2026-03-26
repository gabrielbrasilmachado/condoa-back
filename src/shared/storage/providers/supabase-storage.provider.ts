import { Readable } from 'node:stream'
import {
  type StorageProvider,
  type StorageUploadInput,
} from '../contracts/storage-provider.contract'
import { getStorageConfig } from '../config/storage.config'
import { type StorageUploadResult } from '../types/storage-upload-result'

const readStreamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

const encodeStorageKey = (key: string): string => {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export class SupabaseStorageProvider implements StorageProvider {
  private readonly storageConfig = getStorageConfig()

  private readonly baseUrl = this.storageConfig.supabase.url

  private readonly serviceRoleKey = this.storageConfig.supabase.serviceRoleKey

  private readonly bucket = this.storageConfig.supabase.bucket

  public async uploadFile(
    input: StorageUploadInput
  ): Promise<StorageUploadResult> {
    const body =
      input.body instanceof Readable
        ? await readStreamToBuffer(input.body)
        : input.body

    const response = await fetch(
      `${this.baseUrl}/storage/v1/object/${this.bucket}/${encodeStorageKey(input.key)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
          'x-upsert': 'false',
          'Content-Type': input.contentType || 'application/octet-stream',
        },
        body: new Uint8Array(body),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Falha ao enviar arquivo para o Supabase Storage: ${errorText}`
      )
    }

    return {
      key: input.key,
      bucket: this.bucket,
      url: this.getPublicUrl(input.key),
    }
  }

  public async deleteFile(key: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/storage/v1/object/${this.bucket}/${encodeStorageKey(key)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
        },
      }
    )

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text()
      throw new Error(
        `Falha ao remover arquivo do Supabase Storage: ${errorText}`
      )
    }
  }

  public getPublicUrl(key: string): string {
    return `${this.baseUrl}/storage/v1/object/public/${this.bucket}/${encodeStorageKey(key)}`
  }
}
