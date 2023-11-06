const TAG_FIELD_ALIASES = ['protocol', 'service', 'zone']

export function normalizeFilterFields(fields: [string, string][]): Map<string, any[]> {
  const normalizedFields = new Map<string, any[]>()

  for (const [field, value] of fields) {
    const isTagAlias = TAG_FIELD_ALIASES.includes(field)
    const fieldName = isTagAlias ? 'tag' : field

    if (!normalizedFields.has(fieldName)) {
      normalizedFields.set(fieldName, [])
    }

    const values = normalizedFields.get(fieldName) as string[]
    let processedValue: any

    if (fieldName === 'tag') {
      const tagValue = isTagAlias ? `kuma.io/${field}:${value}` : value

      processedValue = tagValue.replace(/\s+/g, '')
    } else {
      processedValue = value
    }

    values.push(processedValue.trim())
  }

  return normalizedFields
}
