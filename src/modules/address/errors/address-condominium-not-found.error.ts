export class AddressCondominiumNotFoundError extends Error {
  constructor() {
    super('Condomínio informado para o endereço não foi encontrado.')
    this.name = 'AddressCondominiumNotFoundError'
  }
}
