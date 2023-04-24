import { camelCaseToWords } from './camelCaseToWords'
import type { I18n } from './useI18n'

/**
 * Retrieves a human-readable label for a term. If an explicit label is stored in `termLabels`, it will be used; otherwise, the term (expected to be a camel-cased string) will be split into words.
 */
export function getTermLabel(term: string, i18n: I18n): string {
  return i18n.termLabels[term] ?? camelCaseToWords(term)
}
