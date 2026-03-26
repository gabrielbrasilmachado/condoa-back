import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'

export class CondominiumRequestAlreadyReviewedError extends Error {
  constructor(status: CondominiumRequestStatus) {
    super(`Esta solicitação já foi analisada e está com status "${status}".`)
    this.name = 'CondominiumRequestAlreadyReviewedError'
  }
}
