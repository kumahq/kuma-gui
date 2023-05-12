import { camelCaseToWords } from './camelCaseToWords'
import type { I18n } from './useI18n'

/**
 * Retrieves a human-readable label for a term. If an explicit label is stored in `termLabels`, it will be used; otherwise, the term (expected to be a camel-cased string) will be split into words.
 */
export function getTermLabel(term: string, i18n: I18n): string {
  let label

  try {
    label = i18n.t(['termLabels', term])
  } catch {
    // Explicitly catches errors from `i18n.t` as it throws on non-existing translation keys. In the context of this utility, that’s fine. We just try to check if there is a label stored. IF not, we fall back to using `camelCaseToWords`.
  }

  return label ?? camelCaseToWords(term)
}
