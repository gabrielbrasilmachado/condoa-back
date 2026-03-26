export class ItemOwnerWithoutCondominiumError extends Error {
  constructor() {
    super('Não é possível criar item para um usuário sem condomínio vinculado.')
    this.name = 'ItemOwnerWithoutCondominiumError'
  }
}
