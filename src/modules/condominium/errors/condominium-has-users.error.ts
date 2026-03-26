export class CondominiumHasUsersError extends Error {
  constructor() {
    super(
      'Não é possível remover o condomínio porque existem usuários vinculados a ele.'
    )
    this.name = 'CondominiumHasUsersError'
  }
}
