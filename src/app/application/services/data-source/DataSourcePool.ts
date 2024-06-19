import Router from './Router'
import SharedPool from './SharedPool'

type EventSource = {
  configuration: {}
  open: () => void
  close: () => void
} & EventTarget

// The user definable 'Sources' themselves i.e. `/uri/:param` => HTTP call
export type Source = (params: Record<string, unknown>) => unknown
type Sources = Record<string, Source>
type Connection = {
  source: EventSource
  controller: AbortController
}
export type Creator<T extends EventSource = EventSource> = (str: string, router: Router<Source>) => T
export type Destroyer<T extends EventSource = EventSource> = (str: string, source: T) => void

type Cache = Map<string, unknown>

export default class DataSourcePool {
  // a 'pool' of in use DataSources to manage creation and destruction and
  // ensure they are shared singletons
  protected _pool: SharedPool<string, Connection>

  constructor(
    requests: Sources,
    { create, destroy = () => {}, error = () => {} }: { create: Creator, destroy?: Destroyer, error?: (e: Event) => void },
    getCacheKeyPrefix: () => string = () => '',

    // a currently unbounded cache of previous JSON responses that is used to
    // prevent loading spinners etc. i.e. we only use this cache during the time
    // it takes to fire off a request and then receive an updated response
    protected _cache: Cache = new Map(),
    //
  ) {
    const requestRouter: Router<Source> = new Router(requests)

    this._pool = new SharedPool(
      (state, src, connection) => {
        const cacheKey = `${getCacheKeyPrefix()}${src}`
        const dispatchCache = async (source: EventSource) => {
          // we check cache.has() at the call site
          if (!('cacheControl' in source.configuration) || source.configuration.cacheControl !== 'no-cache') {
            await Promise.resolve()
            source.dispatchEvent(
              new MessageEvent('message', { data: this._cache.get(cacheKey) }),
            )
          }
        }
        switch (state) {
          case 'creating': {
            const source = create(src, requestRouter)
            // CallableEventSources are opened upon creation
            // but others maybe not
            source.open()
            const controller = new AbortController()
            // always fill the cache on a successful response and `?no-store` isn't set
            if (!('cacheControl' in source.configuration) || source.configuration.cacheControl !== 'no-store') {
              source.addEventListener('message', (e: Event) => this._cache.set(cacheKey, (e as MessageEvent).data), { signal: controller.signal })
            }
            source.addEventListener('error', error, { signal: controller.signal })
            if (this._cache.has(cacheKey)) {
              dispatchCache(source)
            }
            return {
              source,
              controller,
            }
          }
          case 'destroying':
            if (connection) {
              connection.controller.abort()
              destroy(src, connection.source)
            }
            return connection
          case 'releasing':
            return connection
          case 'acquiring': {
            if (this._cache.has(cacheKey)) {
              dispatchCache(connection.source)
            }
            // CallableEventSources need reopening but are guarded in CallableEventSource
            connection.source.open()
            return connection
          }
        }
      },
    )
  }

  source(src: string, ref: symbol = Symbol('')): EventSource {
    return this._pool.acquire(src, ref).source
  }

  close(src: string, ref: symbol = Symbol('')) {
    return this._pool.release(src, ref)
  }

  destroy() {
    this._cache.clear()
    this._pool.destroy()
  }
}
