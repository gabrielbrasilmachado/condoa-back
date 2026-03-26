export class InvalidCurrentPasswordError extends Error {
  constructor() {
    super('A senha atual informada está incorreta.')
    this.name = 'InvalidCurrentPasswordError'
  }
}
