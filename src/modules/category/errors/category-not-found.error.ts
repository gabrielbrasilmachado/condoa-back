export class CategoryNotFoundError extends Error {
  constructor() {
    super('Categoria não encontrada.')
    this.name = 'CategoryNotFoundError'
  }
}
