export class ItemAccessForbiddenError extends Error {
  constructor() {
    super('Você não tem permissão para alterar este item.')
    this.name = 'ItemAccessForbiddenError'
  }
}
