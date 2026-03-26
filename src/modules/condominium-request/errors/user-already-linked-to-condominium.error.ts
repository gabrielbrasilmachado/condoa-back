export class UserAlreadyLinkedToCondominiumError extends Error {
  constructor() {
    super(
      'O usuário já está vinculado a um condomínio e não pode abrir uma nova solicitação.'
    )
    this.name = 'UserAlreadyLinkedToCondominiumError'
  }
}
