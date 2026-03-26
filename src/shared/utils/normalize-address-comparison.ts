import { normalizeDigits } from './normalize-digits'

const MULTIPLE_SPACES_REGEX = /\s+/g

const normalizeWhitespace = (value: string): string =>
  value.trim().replaceAll(MULTIPLE_SPACES_REGEX, ' ')

export const normalizeAddressZipCode = (value: string): string =>
  normalizeDigits(value)

export const normalizeAddressText = (value: string): string =>
  normalizeWhitespace(value).toLowerCase()

export const normalizeAddressNumber = (value: string): string =>
  normalizeWhitespace(value)

export const normalizeAddressComplement = (
  value: string | null | undefined
): string | null => {
  if (value === null || value === undefined) {
    return null
  }

  const normalizedValue = normalizeAddressText(value)

  return normalizedValue === '' ? null : normalizedValue
}
