import { getStorageConfig } from './config/storage.config'
import { makeStorageProvider } from './factories/storage-provider.factory'

export const storageProvider = makeStorageProvider()
export const storageConfig = getStorageConfig()

export { buildProductImageStorageKey } from './utils/build-storage-key'
export type {
  StorageProvider,
  StorageUploadInput,
} from './contracts/storage-provider.contract'
export type { StorageUploadResult } from './types/storage-upload-result'
