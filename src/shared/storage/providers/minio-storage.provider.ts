import { Readable } from 'node:stream'
import { Client } from 'minio'
import {
  StorageProvider,
  StorageUploadInput,
} from '../contracts/storage-provider.contract'
import { getStorageConfig } from '../config/storage.config'
import { StorageUploadResult } from '../types/storage-upload-result'

type MinioClientInstance = {
  bucketExists(bucket: string): Promise<boolean>
  makeBucket(bucket: string): Promise<void>
  putObject(
    bucket: string,
    key: string,
    body: Buffer | Readable,
    size?: number,
    metaData?: Record<string, string>
  ): Promise<unknown>
  removeObject(bucket: string, key: string): Promise<void>
}

export class MinioStorageProvider implements StorageProvider {
  private readonly client: MinioClientInstance

  private readonly storageConfig = getStorageConfig()

  private readonly bucket = this.storageConfig.minio.bucket

  constructor() {
    this.client = new Client({
      endPoint: this.storageConfig.minio.host,
      port: this.storageConfig.minio.port,
      useSSL: this.storageConfig.minio.useSSL,
      accessKey: this.storageConfig.minio.accessKey,
      secretKey: this.storageConfig.minio.secretKey,
    })
  }

  public async uploadFile(
    input: StorageUploadInput
  ): Promise<StorageUploadResult> {
    await this.ensureBucketExists()

    const metaData = input.contentType
      ? {
          'Content-Type': input.contentType,
        }
      : undefined

    await this.client.putObject(
      this.bucket,
      input.key,
      input.body,
      input.size,
      metaData
    )

    return {
      key: input.key,
      bucket: this.bucket,
      url: this.getPublicUrl(input.key),
    }
  }

  public async deleteFile(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key)
  }

  public getPublicUrl(key: string): string {
    return `${this.storageConfig.minio.publicUrl}/${this.bucket}/${key}`
  }

  private async ensureBucketExists(): Promise<void> {
    const bucketExists = await this.client.bucketExists(this.bucket)

    if (!bucketExists) {
      await this.client.makeBucket(this.bucket)
    }
  }
}
