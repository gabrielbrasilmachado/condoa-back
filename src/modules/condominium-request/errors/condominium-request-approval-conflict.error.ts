export class CondominiumRequestApprovalConflictError extends Error {
  constructor() {
    super(
      'Não é possível aprovar a solicitação porque o usuário já está vinculado a um condomínio.'
    )
    this.name = 'CondominiumRequestApprovalConflictError'
  }
}
