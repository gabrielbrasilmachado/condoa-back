export class AuthConfigurationError extends Error {
  constructor() {
    super('A configuração de autenticação está inválida.')
    this.name = 'AuthConfigurationError'
  }
}
