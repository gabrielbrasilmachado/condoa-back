export class StorageConfigurationError extends Error {
  constructor() {
    super('A configuração de storage está inválida.')
    this.name = 'StorageConfigurationError'
  }
}
