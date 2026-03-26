export const parseCookieHeader = (
  cookieHeader?: string
): Record<string, string> => {
  if (!cookieHeader) {
    return {}
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValueParts] = part.trim().split('=')

    if (!rawKey || rawValueParts.length === 0) {
      return acc
    }

    acc[rawKey] = decodeURIComponent(rawValueParts.join('='))

    return acc
  }, {})
}
