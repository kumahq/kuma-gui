import CallableEventSource, { isClosed } from './CallableEventSource'
import Router from './Router'
import SharedPool from './SharedPool'

// reusable Type Utility for easy to use Types within Vue templates
export type DataSourceResponse<T> = {data: T | undefined, error: Error | undefined, refresh: () => void}

// The user definable 'Sources' themselves i.e. `/uri/:param` => HTTP call
export type Source = (params: Record<string, unknown>, source: {close: () => void}) => Promise<unknown>
export type Sources = Record<string, Source>

const create = (src: string, router: Router<Source>): CallableEventSource => {
  const [path, query] = src.split('?')
  const queryParams = new URLSearchParams(query)
  // use the router to fine which function to call
  const route = router.match(path)
  const _source = new CallableEventSource(async function * (this: CallableEventSource) {
    while (true) {
      this.readyState = 1
      // `.route` here is the function call to the 'source' i.e. the Promise
      // returning call that can be polled in our case right now the HTTP
      // calls but in the future could also be 'listeners' on localStorage, or
      // 'listeners' on a session
      yield route.route({
        ...{
          offset: parseInt(queryParams.get('offset') || '0'),
        },
        ...route.params,
      }, this)
      if (!isClosed(this)) {
        // right now any polling has a 5s interval, we currently just hardcode
        // here but if/when we use this more this should be a user setting
        // that we can save/retrieve from localStorage
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  })
  return _source
}

export class DataSourcePool {
  // a currently unbounded cache of previous JSON responses that is used to
  // prevent loading spinners etc. i.e. we only use this cache during the time
  // it takes to fire off a request and then receive an updated response
  cache: Map<string, unknown> = new Map()

  // a 'pool' of in use DataSources to manage creation and destruction and
  // ensure they are shared singletons
  pool: SharedPool<string, CallableEventSource>

  constructor(requests: Sources) {
    const requestRouter: Router<Source> = new Router(requests)

    this.pool = new SharedPool<string, CallableEventSource>(
      (src: string) => {
        return create(src, requestRouter)
      },
      (_src: string, source: CallableEventSource) => {
        if (source) {
          source.close()
        }
      },
    )
  }

  source(src: string, ref: symbol) {
    return this.open(src, ref)
  }

  open(src: string, ref: symbol): CallableEventSource {
    const _source = this.pool.acquire(src, ref)
    _source.addEventListener('message', (e: Event) => {
      // always fill the cache on a successful response
      this.cache.set(src, (e as MessageEvent).data)
    })
    if (this.cache.has(src)) {
      Promise.resolve().then(() => {
        _source?.dispatchEvent(
          new MessageEvent('message', { data: this.cache.get(src) }),
        )
      })
    }
    return _source
  }

  close(src: string, ref: symbol) {
    return this.pool.release(src, ref)
  }
}
