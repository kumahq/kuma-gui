import CallableEventSource from './CallableEventSource'
import type { Creator, Destroyer } from './DataSourcePool'
export type { DataSourceResponse } from './DataSourcePool'

type Configuration = {
  interval?: number
  retry?: (e: unknown) => Promise<void> | undefined
}
type RetryingEventSource = CallableEventSource<Configuration>
type Hideable = EventTarget & { hidden: boolean }

export const getSource = (doc: Hideable) => {
  return (cb: (source: RetryingEventSource) => Promise<unknown>, config: Configuration = {}) => {
    let attempts = 0
    let iterations = 0
    return new CallableEventSource<Configuration>(async function * (this: RetryingEventSource) {
      const self = this
      while (true) {
        self.readyState = 1
        // this this isn't the first call then we should wait before calling again
        if (iterations > 0) {
          await new Promise((resolve) => setTimeout(resolve, self.configuration.interval ?? 1000))
        }
        if (attempts > 0 || iterations > 0) {
          // if the document/browser tab is hidden then wait for it to regain
          // focus but, for the first call (if we aren't erroring) we probably
          // still want to send of the request, so then at least when you come
          // back you immediately see data
          if (doc.hidden) {
            await new Promise((resolve) => {
              doc.addEventListener('visibilitychange', resolve, { once: true })
            })
          }
        }
        let res
        try {
          res = cb(self)
          // if we aren't polling then immediately close after calling
          if (typeof self.configuration.interval === 'undefined') {
            self.close()
          }
          // only increase iterations if we didn't error
          iterations++
          // return the result
          yield res
        } catch (e) {
          // if retry is configured await it before entering the loop again to
          // try again
          // TODO(jc): we should probably pass through attempts and maybe other
          // things here
          const retry = self.configuration?.retry?.(e)
          if (typeof retry?.then === 'function') {
            // make sure we never mistakenly retry sooner than 1s
            await Promise.all([retry, new Promise(resolve => setTimeout(resolve, 1000))])
            attempts++
          } else {
            throw e
          }
        }
      }
    }, config)
  }
}
export type Source = ReturnType<typeof getSource>

// its fine to not wait for an unfocussed tab for promise returning sources
const source = getSource(new (class extends EventTarget {hidden = false})())

export const create: Creator = (src, router) => {
  const [path, query] = src.split('?')
  const queryParams = new URLSearchParams(query)
  // use the router to find which function to call
  const route = router.match(path)
  const params = {
    ...{
      offset: parseInt(queryParams.get('offset') || '0'),
      size: parseInt(queryParams.get('size') || '0'),
      page: parseInt(queryParams.get('page') || '0'),
      search: queryParams.get('search') || '',
    },
    ...route.params,
  }
  try {
    // TODO(jc) Once we remove all the source.closes in the sources.ts files the
    // second argument here can go
    const init = route.route(params, { close: () => {} })
    if (init instanceof CallableEventSource) {
      return init
    } else {
      return source(() => Promise.resolve(init))
    }
  } catch (e) {
    return source(() => Promise.reject(e))
  }
}
export const destroy: Destroyer = (_src, source) => {
  if (source) {
    source.close()
  }
}

export default {
  create,
  destroy,
}
