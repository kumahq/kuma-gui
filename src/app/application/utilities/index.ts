type URLParamDefault = string | number | boolean
type URLParamValue = string | null

export const beforePaint = function (fn: (...args: any[]) => void) {
  let num: number
  return (...args: unknown[]) => {
    if (num) {
      window.cancelAnimationFrame(num)
    }
    num = window.requestAnimationFrame(fn.bind(fn, ...args))
  }
}
export const createAttrsSetter = ($el = document.documentElement) => {
  if (!$el) {
    return () => {}
  }
  const originalClasses = [...$el.classList]
  return beforePaint((attrs: Record<string, string>[]) => {
    const flat = attrs.reduce<Record<string, string[]>>((prev, item) => {
      return Object.entries(item).reduce(
        (prev, [key, value]) => {
          if (typeof prev[key] === 'undefined') {
            prev[key] = []
          }
          prev[key].push(value)
          return prev
        }, prev,
      )
    }, {})

    $el.classList.remove(...[...$el.classList].filter(item => !originalClasses.includes(item)))
    $el.classList.add(...(flat.class || []))
  })
}
// normalizes url params from "value or array of values" to value
// if the url params is an array we use the first value
export const urlParam = function <T extends URLParamValue> (param: T | T[]): T {
  return (Array.isArray(param) ? param[0] : param)
}

//
export const normalizeUrlParam = (param: URLParamValue, def: URLParamDefault): URLParamDefault => {
  switch (true) {
    case typeof def === 'boolean':
      return param === null ? true : def
    case typeof def === 'number': {
      const value = param === null || param.length === 0 ? def : Number(decodeURIComponent(param))
      if (isNaN(value)) {
        return Number(def)
      } else {
        return value
      }
    }
    case typeof def === 'string': {
      return param === null || param.length === 0 ? def : decodeURIComponent(param)
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
export const cleanQuery = <T extends Record<string, unknown>>(params: Record<string, string | boolean | undefined>, originalQuery: T) => {
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
