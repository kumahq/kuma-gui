import CallableEventSource from './CallableEventSource'
import Router from './Router'
import SharedPool from './SharedPool'

// The user definable 'Sources' themselves i.e. `/uri/:param` => HTTP call
export type Source = (params: Record<string, unknown>, source: {close: () => void}) => Promise<unknown>
export type Sources = Record<string, Source>
// reusable Type Utility for easy to use Types within Vue templates
export type DataSourceResponse<T> = {
  data: T | undefined
  isLoading: boolean
  error: Error | undefined
  refresh: () => void
}
export type Creator = (str: string, router: Router<Source>) => CallableEventSource
export type Destroyer = (str: string, source: CallableEventSource) => void

export class DataSourcePool {
  // a currently unbounded cache of previous JSON responses that is used to
  // prevent loading spinners etc. i.e. we only use this cache during the time
  // it takes to fire off a request and then receive an updated response
  cache: Map<string, unknown> = new Map()

  // a 'pool' of in use DataSources to manage creation and destruction and
  // ensure they are shared singletons
  pool: SharedPool<string, CallableEventSource>

  getCacheKeyPrefix: () => string

  constructor(requests: Sources, { create, destroy }: {create: Creator, destroy: Destroyer}, getCacheKeyPrefix: () => string) {
    const requestRouter: Router<Source> = new Router(requests)

    this.pool = new SharedPool<string, CallableEventSource>(
      (src: string) => {
        return create(src, requestRouter)
      },
      (src: string, source: CallableEventSource) => {
        destroy(src, source)
      },
    )

    this.getCacheKeyPrefix = getCacheKeyPrefix
  }

  source(src: string, ref: symbol): CallableEventSource {
    const cacheKey = this.getCacheKeyPrefix() + src
    const _source = this.pool.acquire(src, ref)
    _source.addEventListener('message', (e: Event) => {
      // always fill the cache on a successful response
      this.cache.set(cacheKey, (e as MessageEvent).data)
    })
    if (this.cache.has(cacheKey)) {
      Promise.resolve().then(() => {
        _source?.dispatchEvent(
          new MessageEvent('message', { data: this.cache.get(cacheKey) }),
        )
      })
    }
    return _source
  }

  close(src: string, ref: symbol) {
    return this.pool.release(src, ref)
  }
}
