export function camelCaseToWords(str: string): string {
  const words = str
    .split(/([A-Z][a-z]+)/)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return words.charAt(0).toUpperCase() + words.substring(1)
}
