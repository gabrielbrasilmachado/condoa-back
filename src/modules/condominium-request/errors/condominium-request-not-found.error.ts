export class CondominiumRequestNotFoundError extends Error {
  constructor() {
    super('Solicitação de vínculo com condomínio não encontrada.')
    this.name = 'CondominiumRequestNotFoundError'
  }
}
