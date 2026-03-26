export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Já existe um usuário com este e-mail.')
    this.name = 'EmailAlreadyInUseError'
  }
}
