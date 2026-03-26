export class CondominiumRequestCondominiumNotFoundError extends Error {
  constructor() {
    super('Condomínio informado para a solicitação não foi encontrado.')
    this.name = 'CondominiumRequestCondominiumNotFoundError'
  }
}
