import { normalizeDigits } from './normalize-digits'

const CNPJ_LENGTH = 14
const REPEATED_DIGITS_REGEX = /^(\d)\1+$/

const calculateCnpjCheckDigit = (digits: string): number => {
  let weight = digits.length - 7

  const sum = digits.split('').reduce((accumulator, digit) => {
    const nextValue = accumulator + Number(digit) * weight

    weight = weight === 2 ? 9 : weight - 1

    return nextValue
  }, 0)

  const remainder = sum % 11

  return remainder < 2 ? 0 : 11 - remainder
}

export const validateCnpj = (value: string): boolean => {
  const normalizedCnpj = normalizeDigits(value)

  if (
    normalizedCnpj.length !== CNPJ_LENGTH ||
    REPEATED_DIGITS_REGEX.test(normalizedCnpj)
  ) {
    return false
  }

  const baseDigits = normalizedCnpj.slice(0, 12)
  const firstCheckDigit = calculateCnpjCheckDigit(baseDigits)
  const secondCheckDigit = calculateCnpjCheckDigit(
    `${baseDigits}${firstCheckDigit}`
  )

  return normalizedCnpj === `${baseDigits}${firstCheckDigit}${secondCheckDigit}`
}
