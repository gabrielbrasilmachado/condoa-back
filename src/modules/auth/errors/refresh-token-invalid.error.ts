export class RefreshTokenInvalidError extends Error {
  constructor() {
    super('Refresh token inválido, ausente ou expirado.')
    this.name = 'RefreshTokenInvalidError'
  }
}
