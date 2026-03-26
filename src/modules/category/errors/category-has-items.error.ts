export class CategoryHasItemsError extends Error {
  constructor() {
    super(
      'Não é possível remover a categoria porque existem itens vinculados a ela.'
    )
    this.name = 'CategoryHasItemsError'
  }
}
