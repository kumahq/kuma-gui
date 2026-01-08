type URLParamDefault = string | number | boolean | NumberConstructor | StringConstructor | BooleanConstructor
type URLParamValues = string | number | boolean
type URLParamValue = string | null

const difference = <T>(a: T[], b: T[]): T[] => a.filter(item => !b.includes(item))

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
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

    const currentClasses = difference([...$el.classList], originalClasses)
    $el.classList.remove(...difference(currentClasses, flat.class))
    $el.classList.add(...difference(flat.class, currentClasses))
  })
}

export const urlParam = function <T extends URLParamValue> (param: T | T[]): T {
  return (Array.isArray(param) ? param[0] : param)
}

export const normalizeUrlParam = (param: URLParamValue, definition: URLParamDefault): URLParamValues => {
  switch (true) {
    case definition === Boolean:
      return param === null ? true : !!param
    case typeof definition === 'boolean':
      return param === null ? true : definition
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
    case definition === String:
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

export const cleanQuery = <T extends Record<string, unknown>>(params: Record<string, string | boolean | number | undefined>, originalQuery: T) => {
  const query = {
    ...originalQuery as Record<string, string | undefined | null>,
  }
  const processed = Object.entries(params).reduce((prev, [key, value]) => {
    switch (true) {
      case value === true:
        prev[key] = null
        break
      case value !== false && String(value).length > 0:
        prev[key] = encodeURIComponent(String(value))
        break
      default:
        prev[key] = undefined
    }
    return prev
  }, query)
  return {
    ...query,
    ...processed,
  }
}
