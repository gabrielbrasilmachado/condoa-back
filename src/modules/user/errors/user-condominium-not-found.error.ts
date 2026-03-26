export class UserCondominiumNotFoundError extends Error {
  constructor() {
    super('Condomínio informado para o usuário não foi encontrado.')
    this.name = 'UserCondominiumNotFoundError'
  }
}
