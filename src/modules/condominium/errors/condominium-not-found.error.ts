export class CondominiumNotFoundError extends Error {
  constructor() {
    super('Condomínio não encontrado.')
    this.name = 'CondominiumNotFoundError'
  }
}
