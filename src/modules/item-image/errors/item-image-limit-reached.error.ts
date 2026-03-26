export class ItemImageLimitReachedError extends Error {
  constructor() {
    super('O item já possui o limite máximo de 3 imagens.')
    this.name = 'ItemImageLimitReachedError'
  }
}
