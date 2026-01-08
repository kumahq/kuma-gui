import jsYaml from 'js-yaml'

export const runInDebug = (func: () => void) => {
  if (import.meta.env.PROD) return
  func()
}

export const YAML = {
  stringify: (json: any) => {
    return jsYaml
      .dump(json, { lineWidth: -1 })
      // Removes the trailing new line js-yaml is outputting.
      .replace(/\n$/, '')
  },
  parse: (str: string) => {
    return jsYaml
      .load(str)
  },
}

export function get(obj: any, path: string, defaultValue: any = undefined): any {
  if (!(typeof obj === 'object') || Array.isArray(obj)) {
    return defaultValue
  }

  const props = path.split('.')
  if (props.length === 1) {
    const value = obj[props[0]]
    return typeof value === 'undefined' ? defaultValue : value
  }

  return get(obj[props[0]], props.slice(1).join('.'), defaultValue)
}

/**
 * Traverses an object recursively to find a given `key` and returns its value.
 * @param o The object that will be traversed to find the `key`.
 * @param key The `key` to search for. Can be a string or a RegExp.
 * @returns The value found for the given `key`, or `undefined` if not found.
 * @example
 * const data = {
 *   level1: {
 *     level2: {
 *       targetKey: 'targetValue',
 *     },
 *   },
 * }
 * findDeep(data, 'targetKey') // returns 'targetValue'
 */
export function findDeep<T = unknown>(o: any, key: string | RegExp): T | undefined {
  if (typeof o !== 'object' || o === null) {
    return undefined
  }
  if ((typeof key === 'string' && key in o)) {
    return o[key]
  }
  if(key instanceof RegExp && Object.keys(o).some(k => key.test(k))) {
    const foundKey = Object.keys(o).find(k => key.test(k))!
    return o[foundKey]
  }
  if (Array.isArray(o)) {
    for (const item of o) {
      const result = findDeep<T>(item, key)
      if(result) {
        return result
      }
    }
  }
  for (const k of Object.keys(o)) {
    const result = findDeep<T>(o[k], key)
    if (result) {
      return result
    }
  }
  return undefined
}
