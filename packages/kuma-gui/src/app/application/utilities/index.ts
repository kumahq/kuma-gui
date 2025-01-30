import jsYaml from 'js-yaml'

type URLParamDefault = string | number | boolean | NumberConstructor | StringConstructor
type URLParamValues = string | number | boolean
type URLParamValue = string | null

export const runInDebug = (func: () => void) => {
  if (import.meta.env.PROD) return
  func()
}
const difference = <T>(a: T[], b: T[]): T[] => a.filter(item => !b.includes(item))

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export const YAML = {
  stringify: (json: any) => {
    return jsYaml
      .dump(json, { lineWidth: -1 })
      // Removes the trailing new line js-yaml is outputting.
      .replace(/\n$/, '')
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
const createUniqueId = (j = 0) => {
  let i = j
  return (prefix = 'unique') => {
    i++
    return `${prefix}-${i}`
  }
}

export const uniqueId = createUniqueId()

export const beforePaint = <T extends (...args: any[]) => void>(fn: T) => {
  let num: number
  return (...args: Parameters<T>) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}

const supportedAttrs = ['class'] as const
type SupportedAttrs = typeof supportedAttrs[number]
export const createAttrsSetter = ($el = document.documentElement) => {
  if (!$el) {
    return () => { }
  }
  const originalClasses = [...$el.classList]
  return beforePaint((attrs: Partial<Record<SupportedAttrs, string>>[]) => {
    const flat = attrs.reduce<Record<SupportedAttrs, string[]>>((prev, item) => {
      return Object.entries(item).reduce(
        (prev, [key, value]) => {
          if (includes(supportedAttrs, key) && value) {
            prev[key].push(value)
          }
          return prev
        }, prev,
      )
    }, { class: [] })

    // omit any classes that were on the node previous to our application starting
    const currentClasses = difference([...$el.classList], originalClasses)
    // anything in currentClasses that isn't in our tree of attrs, remove
    $el.classList.remove(...difference(currentClasses, flat.class))
    // anything in our tree of attrs that isn't in currentClasses, add
    $el.classList.add(...difference(flat.class, currentClasses))
  })
}

// normalizes url params from "value or array of values" to value
// if the url params is an array we use the first value
export const urlParam = function <T extends URLParamValue> (param: T | T[]): T {
  return (Array.isArray(param) ? param[0] : param)
}

//
export const normalizeUrlParam = (param: URLParamValue, definition: URLParamDefault): URLParamValues => {
  switch (true) {
    case typeof definition === 'boolean':
      return param === null ? true : definition
    case definition === Number:
      // We are using ?? here because we hardcode the defaults for String/Number
      // so they can never be null
      return Number(decodeURIComponent(param ?? ''))
    case typeof definition === 'number': {
      const value = param === null || param.length === 0 ? definition : Number(decodeURIComponent(param))
      if (isNaN(value)) {
        return Number(definition)
      } else {
        return value
      }
    }
    case definition === String:
      // We are using ?? here because we hardcode the defaults for String/Number
      // so they can never be null
      return decodeURIComponent(String(param ?? ''))
    case typeof definition === 'string': {
      return param === null || param.length === 0 ? definition : decodeURIComponent(param)
    }
  }
  throw new TypeError('URL parameters can only be string | number | boolean')
}
export const createTitleSetter = ($doc = document) => {
  return beforePaint((title) => {
    $doc.title = title
  })
}
// when used with router.push, prevents things like `q=` (i.e. key= but with no value)
export const cleanQuery = <T extends Record<string, unknown>>(params: Record<string, string | boolean | number | undefined>, originalQuery: T) => {
  const query = {
    ...originalQuery as Record<string, string | undefined | null>,
  }
  const processed = Object.entries(params).reduce((prev, [key, value]) => {
    // Only add parameters for non-empty strings or non-false boolean
    switch (true) {
      case value === true:
        // if the value is strictly true that means we use shorthand boolean true
        // i.e. `?prop`
        prev[key] = null
        break
      case value !== false && String(value).length > 0:
        // if we aren't strictly false (which will use the default)
        // convert to a string and check the length
        // anything greater than zero encode and use
        prev[key] = encodeURIComponent(String(value))
        break
      default:
        // false, or any zero length value unset entirely
        prev[key] = undefined
    }
    return prev
  }, query)
  return {
    ...query,
    ...processed,
  }
}
