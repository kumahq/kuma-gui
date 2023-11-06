/**
 * Tokenizes a filter query into its fields and values.
 *
 * @param query The filter query (e.g. `"tag:'kuma.io/zone: cluster-1' tag:'version:2' name:cluster"`).
 * @param allowedFields A list of field names that are allowed. When not empty, a non-existing field reference in the query will cause an error to be thrown.
 * @returns a list of fields and their values as entries.
 */
export function tokenizeFieldFilterQuery(query: string, allowedFields: string[]): [string, string][] {
  // Prefixes the query with a space in order to easier detect field names.
  const prefixedQuery = ' ' + query
  // Matches field names in the query. Field names may contain general word characters and also, spaces and dashes.
  const fieldMatches = prefixedQuery.matchAll(/ ([-\s\w]+):\s*/g)
  const fieldEntries: [string, string][] = []

  for (const match of Array.from(fieldMatches)) {
    if (match.index === undefined) {
      continue
    }

    // Normalizes field names. Allows field names to be written in dash or space-delimited form (e.g. “name-prefix” or “name prefix” instead of “name”).
    const fieldName = getCamelCasedField(match[1])

    if (allowedFields.length > 0 && !allowedFields.includes(fieldName)) {
      throw new Error(`Unknown field “${fieldName}”. Known fields: ${allowedFields.join(', ')}`)
    }

    // Cuts up the query from the start position of the *next* value to simplify look ups and checks down the line.
    const valueStartPos = match.index + match[0].length
    const tail = prefixedQuery.substring(valueStartPos)
    let value

    // Checks for a quoted value first as that can contain space characters which would otherwise be incorrectly detected as the end of the value in the logic for non-quoted values.
    const isQuotedValue = /^\s*["']/.test(tail)
    if (isQuotedValue) {
      const quotedValueMatch = tail.match(/['"](.*?)['"]/)

      if (quotedValueMatch !== null) {
        value = quotedValueMatch[1]
      } else {
        throw new Error(`Quote mismatch for field “${fieldName}”.`)
      }
    } else {
      const nextSpacePos = tail.indexOf(' ')
      const valueEndPos = nextSpacePos === -1 ? tail.length : nextSpacePos
      value = tail.substring(0, valueEndPos)
    }

    // Ignores empty values.
    if (value === '') {
      continue
    }

    fieldEntries.push([fieldName, value])
  }

  return fieldEntries
}

/**
 * @returns a camel-cased version of a dash-delimited string.
 */
function getCamelCasedField(fieldName: string): string {
  return fieldName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-[a-z]/g, (match, index) => index === 0 ? match : match.substring(1).toUpperCase())
}
