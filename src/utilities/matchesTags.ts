import type { InspectRuleMatcher, Tags } from '@/types/index.d'

/**
 * Matches a set of matchers against a set of tags. They match if the matchers are a subset of the tags.
 */
export function matchesTags(tags: Tags, matchers: InspectRuleMatcher[]): boolean {
  for (const matcher of matchers) {
    if (
      (matcher.not && tags[matcher.key] === matcher.value) ||
      (!matcher.not && tags[matcher.key] !== matcher.value)
    ) {
      return false
    }
  }

  return true
}
