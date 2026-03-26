import { normalizeDigits } from './normalize-digits'

const CPF_LENGTH = 11
const REPEATED_DIGITS_REGEX = /^(\d)\1+$/

const calculateCpfCheckDigit = (
  digits: string,
  initialWeight: number
): number => {
  const sum = digits.split('').reduce((accumulator, digit, index) => {
    return accumulator + Number(digit) * (initialWeight - index)
  }, 0)

  const remainder = (sum * 10) % 11

  return remainder === 10 ? 0 : remainder
}

export const validateCpf = (value: string): boolean => {
  const normalizedCpf = normalizeDigits(value)

  if (
    normalizedCpf.length !== CPF_LENGTH ||
    REPEATED_DIGITS_REGEX.test(normalizedCpf)
  ) {
    return false
  }

  const baseDigits = normalizedCpf.slice(0, 9)
  const firstCheckDigit = calculateCpfCheckDigit(baseDigits, 10)
  const secondCheckDigit = calculateCpfCheckDigit(
    `${baseDigits}${firstCheckDigit}`,
    11
  )

  return normalizedCpf === `${baseDigits}${firstCheckDigit}${secondCheckDigit}`
}
