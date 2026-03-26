export class AddressAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um endereço cadastrado para este condomínio.')
    this.name = 'AddressAlreadyExistsError'
  }
}
