export class CondominiumRequestAlreadyPendingError extends Error {
  constructor() {
    super(
      'O usuário já possui uma solicitação pendente de vínculo com condomínio.'
    )
    this.name = 'CondominiumRequestAlreadyPendingError'
  }
}
