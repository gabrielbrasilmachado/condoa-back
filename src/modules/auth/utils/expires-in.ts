const TIME_UNITS_IN_MILLISECONDS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
}

export const expiresInToMilliseconds = (value: string | number): number => {
  if (typeof value === 'number') {
    return value * 1000
  }

  const trimmedValue = value.trim()

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue) * 1000
  }

  const match = trimmedValue.match(/^(\d+)([smhd])$/i)

  if (!match) {
    throw new Error('Formato de expiração inválido.')
  }

  const [, amount, unit] = match

  return Number(amount) * TIME_UNITS_IN_MILLISECONDS[unit.toLowerCase()]
}
