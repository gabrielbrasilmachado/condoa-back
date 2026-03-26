export class CategoryAlreadyExistsError extends Error {
  constructor() {
    super('Já existe uma categoria com este nome.')
    this.name = 'CategoryAlreadyExistsError'
  }
}
