export class ItemOwnerNotFoundError extends Error {
  constructor() {
    super('Usuário dono do item não foi encontrado.')
    this.name = 'ItemOwnerNotFoundError'
  }
}
