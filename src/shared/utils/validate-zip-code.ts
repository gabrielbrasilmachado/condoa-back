import { normalizeDigits } from './normalize-digits'

const ZIP_CODE_LENGTH = 8
const REPEATED_DIGITS_REGEX = /^(\d)\1+$/

export const validateZipCode = (value: string): boolean => {
  const normalizedZipCode = normalizeDigits(value)

  return (
    normalizedZipCode.length === ZIP_CODE_LENGTH &&
    !REPEATED_DIGITS_REGEX.test(normalizedZipCode)
  )
}
