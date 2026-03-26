import { getStorageConfig } from '../config/storage.config'
import { StorageProvider } from '../contracts/storage-provider.contract'
import { MinioStorageProvider } from '../providers/minio-storage.provider'
import { SupabaseStorageProvider } from '../providers/supabase-storage.provider'

export const makeStorageProvider = (): StorageProvider => {
  const storageConfig = getStorageConfig()

  switch (storageConfig.provider) {
    case 'minio':
      return new MinioStorageProvider()
    case 'supabase':
      return new SupabaseStorageProvider()
    default:
      throw new Error(
        `Storage provider não suportado: ${storageConfig.provider}`
      )
  }
}
