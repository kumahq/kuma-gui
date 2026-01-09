export type URLParamNormalized = string | number | boolean
export type URLParamDefinition = URLParamNormalized | NumberConstructor | StringConstructor | BooleanConstructor
export type URLParamValue = string | null

/**
 * Extracts the first value from a URL parameter that may be an array or a single value.
 * Useful for handling query parameters that could have multiple values but
 * only single values are supported.
 *
 * @param param - A URL parameter value (string, null) or an array of such values
 * @returns The first value if an array, otherwise the value itself
 *
 * @example
 * urlParam(['foo', 'bar']) // 'foo'
 * urlParam('baz') // 'baz'
 * urlParam([null]) // null
 */
export const urlParam = function <T extends URLParamValue> (param: T | T[]): T {
  return (Array.isArray(param) ? param[0] : param)
}

/**
 * Handles conversion of URL parameter strings to appropriate JavaScript
 * types (string, number, boolean) with support for default values.
 *
 * **Note** when asking for a `boolean`, `null` is converted to `true` for
 * flag-style params like ?param
 *
 * @param param - The raw URL parameter value (string or null). Anything URL
 *   encoded will be decoded.
 * @param definition - Default value or JS Type to be used (type is
 *   inferred from the default value if that is used). Type definition or
 *   default value:
 *   - `Boolean`: converts to boolean as you would expect, apart from
 *     `null`. `null` will convert to `true` to support `&param` type
 *     query params
 *   - `Number`: converts to number via Number constructor, avoids NaN
 *   - `String`: converts to string (null → empty string)
 *
 * @returns The normalized and decoded value as a string, number, or boolean
 *
 * @example
 * normalizeUrlParam('42', Number) // 42
 * normalizeUrlParam(null, 10) // 10
 * normalizeUrlParam('hello%20world', String) // 'hello world'
 * normalizeUrlParam(null, Boolean) // true
 */
export const normalizeUrlParam = (param: URLParamValue, definition: URLParamDefinition): URLParamNormalized => {
  switch (true) {

    // Boolean/boolean
    case definition === Boolean:
      return param === null ? true : !!param
    case typeof definition === 'boolean':
      return param === null ? true : definition

    // Number/number
    case definition === Number:
      return Number(decodeURIComponent(param ?? ''))
    case typeof definition === 'number': {
      const value = param === null || param.length === 0 ? definition : Number(decodeURIComponent(param))
      if (isNaN(value)) {
        return Number(definition)
      } else {
        return value
      }
    }

    // String/string
    case definition === String:
      return decodeURIComponent(String(param ?? ''))
    case typeof definition === 'string': {
      return param === null || param.length === 0 ? definition : decodeURIComponent(param)
    }
  }
  throw new TypeError('URL default parameter/definition can only be string | number | boolean')
}


/**
 * Converts a normalized URL parameter value into its query string representation.
 * Handles encoding and special boolean/`null` cases for URL query parameters.
 *
 * @param value - The normalized parameter value to serialize
 * @returns Serialized value for use in query strings:
 *   - `true` → `null` (flag-style param like `?debug`)
 *   - `false` → `undefined` (removes flag-style param like `?debug`)
 *   - `''` empty strings → `undefined` (removes the parameter)
 *
 * @example
 * serializeUrlParam(true) // null (becomes ?param in URL)
 * serializeUrlParam(false) // undefined (param removed)
 * serializeUrlParam('hello world') // 'hello%20world'
 * serializeUrlParam(42) // '42'
 * serializeUrlParam('') // undefined
 */
export const serializeUrlParam = (value: URLParamNormalized | undefined) => {
  switch (true) {
    case typeof value === 'undefined':
    case value === false:
      return
    case value === true:
      return null
    case String(value).length > 0:
      return encodeURIComponent(String(value))
    default:
      return
  }
}

/**
 * Merges parameter changes into an existing query object, handling URL encoding
 * and converting values to appropriate query string formats.
 *
 * @param query - The existing query object to merge with
 * @param params - New parameters to merge. Supports:
 *   - `true`: converts to `null` (for flag-style params like `?debug`)
 *   - `false`/`''`: removes the parameter (sets to `undefined`)
 * @returns A new query object with merged and encoded parameters
 *
 * @example
 * mergeQuery({ keep: 'this', old: null }, { foo: 'bar', debug: true, old: false })
 * // { keep: 'this', foo: 'bar', debug: null }
 */
export const mergeQuery = (
  originalQuery: Record<string, URLParamValue | URLParamValue[]>,
  params: Record<string, URLParamNormalized | undefined>,
) => {
  const query: Record<string, URLParamValue | URLParamValue[] | undefined> = {
    ...originalQuery,
  }
  const serialized = Object.entries(params).reduce((prev, [key, value]) => {
    prev[key] = serializeUrlParam(value)
    return prev
  }, query)
  return Object.fromEntries(
    Object.entries(serialized).filter(([_, val]) => typeof val !== 'undefined'),
  )
}
