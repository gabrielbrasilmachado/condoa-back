export class CondominiumAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um condomínio com este nome.')
    this.name = 'CondominiumAlreadyExistsError'
  }
}
