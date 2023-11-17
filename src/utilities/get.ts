/**
 * Retrieves the value of an object’s property by traversing a dot-separated path like `'prop1.prop2.prop3'`.
 */
export function get(obj: any, pathOrProps: string | string[], defaultValue: any = undefined): any {
  if (
    !(typeof obj === 'object') ||
    (Array.isArray(pathOrProps) && pathOrProps.length === 0)
  ) {
    return defaultValue
  }

  const props = Array.isArray(pathOrProps) ? pathOrProps : pathOrProps.split(/[.[\]]/).filter((prop) => prop !== '')
  const prop = props[0]
  // Strips a quoted value from its quotes (e.g. "key" → key).
  const strippedProp = prop.match(/(['"]).+\1/) !== null ? prop.substring(1, prop.length - 1) : prop

  if (props.length === 1) {
    return strippedProp in obj ? obj[strippedProp] : defaultValue
  }

  return get(obj[strippedProp], props.slice(1), defaultValue)
}
