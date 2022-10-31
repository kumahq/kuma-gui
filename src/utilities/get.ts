/**
 * Retrieves the value of an object’s property by traversing a dot-separated path like `'prop1.prop2.prop3'`.
 */
export function get(obj: any, path: string, defaultValue: any = undefined): any {
  if (!(typeof obj === 'object') || Array.isArray(obj)) {
    return defaultValue
  }

  const dotPosition = path.indexOf('.')

  if (dotPosition === -1) {
    return obj[path] === undefined ? defaultValue : obj[path]
  }

  const prop = path.substring(0, dotPosition)
  const newPath = path.substring(dotPosition + 1)

  return get(obj[prop], newPath, defaultValue)
}
