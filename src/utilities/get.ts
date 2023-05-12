/**
 * Retrieves the value of an object’s property by traversing a dot-separated path like `'prop1.prop2.prop3'`.
 */
export function get(obj: any, pathOrProps: string | string[], defaultValue: any = undefined): any {
  if (
    !(typeof obj === 'object') ||
    Array.isArray(obj) ||
    (Array.isArray(pathOrProps) && pathOrProps.length === 0)
  ) {
    return defaultValue
  }

  const props = Array.isArray(pathOrProps) ? pathOrProps : pathOrProps.split('.')

  if (props.length === 1) {
    const value = obj[props[0]]

    return value === undefined ? defaultValue : value
  }

  return get(obj[props[0]], props.slice(1), defaultValue)
}
