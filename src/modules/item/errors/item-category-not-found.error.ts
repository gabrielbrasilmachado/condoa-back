export class ItemCategoryNotFoundError extends Error {
  constructor() {
    super('Categoria informada para o item não foi encontrada.')
    this.name = 'ItemCategoryNotFoundError'
  }
}
