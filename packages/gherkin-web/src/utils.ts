import deepmerge from 'deepmerge'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { pathToRegexp } from 'path-to-regexp'

import type { ArrayMergeOptions } from 'deepmerge'

// merges objects in array positions rather than replacing
const undefinedSymbol = Symbol('undefined')
const combineMerge = (target: object[], source: object[], options: ArrayMergeOptions): object[] => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

export const merge = <T>(response: T, obj: Partial<T>): T => {
  const merged = deepmerge<T>(response, obj, { arrayMerge: combineMerge })
  return JSON.parse(JSON.stringify(merged, (_key, value) => {
    if (value === undefinedSymbol) {
      return
    }
    return value
  }))
}
export const YAML = {
  parse: (str: string) => {
    return jsYaml.load(str, {
      schema: DEFAULT_SCHEMA.extend([
        new Type('tag:yaml.org,2002:js/undefined', {
          kind: 'scalar',
          construct: () => {
            return undefinedSymbol
          },
        }),
      ]),
    })
  },
}

export const Cookie = {
  parse: (str: string, { prefix = '' } = { prefix: '' }) => {
    return Object.fromEntries(str.split(';')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => {
        const [key, ...value] = item.split('=')
        return [key, value.join('=')] as [string, string]
      })
      .filter(([key, _value]) => key.startsWith(prefix)))
  },
}
export const routeToRegexp = (route: string) => {
  const url = new URL(route, !route.includes('://') ? 'http://localhost' : undefined)
  // escape `:`s for pathToRegexp's named segments (/:segment/)
  const origin = url.origin.replaceAll(':', '\\:')
  const { regexp } = pathToRegexp(`${route.includes('://') ? origin : ''}${url.pathname}`)
  // remove the end of pathToRegexps regexp
  // and replace it with optional `/` and optional `?<optional chars>`
  const re = new RegExp(
    regexp.toString().replace('(?:\\/$)?$/i', '(?:\\/)?(\\?.*)?$').substring(1), 'i',
  )
  return re
}
