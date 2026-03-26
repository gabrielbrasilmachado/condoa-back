export class ItemImageNotFoundError extends Error {
  constructor() {
    super('Imagem do item não encontrada.')
    this.name = 'ItemImageNotFoundError'
  }
}
