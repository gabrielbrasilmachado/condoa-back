const NON_DIGIT_REGEX = /\D/g

export const normalizeDigits = (value: string): string =>
  value.replaceAll(NON_DIGIT_REGEX, '')
