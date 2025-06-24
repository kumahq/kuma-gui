import { compile } from 'path-to-regexp'

import CallableEventSource from './CallableEventSource'
import type { Creator, Destroyer } from './DataSourcePool'
export { default as DataSourcePool } from './DataSourcePool'
// reusable Type Utility for easy to use Types within Vue templates
export type DataSourceResponse<T> = {
  data: T | undefined
  error: Error | undefined
  refresh: () => void
}
type PaginationParams = {
  size: number
  page: number
  search: string
  cacheControl: string
}

type ExtractRouteParams<T extends PropertyKey> =
  string extends T
    ? Record<string, string>
    : T extends `${infer _Start}:${infer Param}/${infer Rest}`
      ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
      : T extends `${infer _Start}:${infer Param}`
        ? { [k in Param]: string }
        : {}

export type ExtractSources<T extends Record<PropertyKey, unknown>> = {
  [Route in keyof T]: (params: ExtractRouteParams<Route> & PaginationParams, controller: AbortController) => T[Route]
}

export const defineSources = <T extends Record<PropertyKey, unknown>>(sources: ExtractSources<T>) => {
  return sources
}

type Sources = Record<PropertyKey, (...args: any[]) => any>
type SourceFactory = (...args: any[]) => Sources
export type TypeOf<T> = T extends { typeOf(): any } ? ReturnType<T['typeOf']> : any

const AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { }).constructor
const isAsyncGeneratorFunction = (fn: unknown): fn is AsyncGeneratorFunction => {
  return fn instanceof AsyncGeneratorFunction
}
class TypedString<T = unknown> {
  constructor(
    protected str: string,
  ) { }

  toString() {
    return this.str
  }

  typeOf() {
    return undefined as T
  }
}

type AwaitedYieldType<T extends ((...args: any) => AsyncGenerator<any, any, any>) | ((...args: any) => Awaited<any>)> =
  T extends (...args: any) => AsyncGenerator<infer R, any, any> ? R :
    T extends (...args: any) => infer R ? Awaited<R> : never

const cache = new Map()
export const useUri = () => {
  return <T extends SourceFactory, K extends keyof ReturnType<T>>(_typeRef: T, src: K, params: ExtractRouteParams<K>, query: Partial<PaginationParams> = {}) => {
    const str = String(src)
    if (!cache.has(str)) {
      cache.set(str, compile(str))
    }
    const interpolate = cache.get(str)
    const q = Object.entries(query).reduce<string[]>((prev, [key, value]) => prev.concat(`${key}=${value}`), [])
    const uri = `${interpolate(params)}${q.length > 0 ? `?${q.join('&')}` : ''}`
    return new TypedString<AwaitedYieldType<ReturnType<T>[K]>>(uri)
  }
}


export const create: Creator = (src, router) => {
  const [path, query] = src.split('?')
  const queryParams = new URLSearchParams(query)
  // use the router to find which function to call
  const route = router.match(path)
  const params = {
    ...{
      size: parseInt(queryParams.get('size') || '0'),
      page: parseInt(queryParams.get('page') || '0'),
      search: queryParams.get('search') || '',
      cacheControl: [
        'no-store',
        'no-cache',
        'immutable',
      ].reduce((prev, item) => queryParams.has(item) ? item : prev, queryParams.get('cacheControl') ?? ''),
    },
    ...route.params,
  }

  const waitForEvent = (target: EventTarget, event: string) => {
    return new Promise((resolve) => {
      target.addEventListener(event, resolve, { once: true })
    })
  }

  return new CallableEventSource(async function* (controller: AbortController) {
    let retry = 0
    const maxRetry = 3
    // @TODO: enable retries based on certain errors
    const enableRetries = false
    while (true) {
      try {
        if (isAsyncGeneratorFunction(route.route)) {
          for await (const res of route.route(params, controller)) {
            yield res
            if (document && document.hidden) {
              await waitForEvent(document, 'visibilityhidden')
            }
          }
        } else {
          yield Promise.resolve(route.route(params))
        }
        break
      } catch (e) {
        if (enableRetries) {
          if (retry < maxRetry) {
            await new Promise(resolve => setTimeout(resolve, 3000 * Math.pow(++retry, 1)))
          } else {
            throw e
          }
        } else {
          throw e
        }
      }
    }
  }, {
    cacheControl: params.cacheControl.length > 0 ? params.cacheControl : undefined,
  })
}
export const destroy: Destroyer = (_src, source) => {
  if (source) {
    source.close()
  }
}
