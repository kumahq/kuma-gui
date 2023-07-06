import CallableEventSource, { isClosed } from './CallableEventSource'
import Router from './Router'
import SharedPool from './SharedPool'

export type DataSourceResponse<T> = {data: T | undefined, error: Error | undefined, refresh: () => void}
export type Source = (params: Record<string, unknown>, source: {close: () => void}) => Promise<unknown>
export type Sources = Record<string, Source>

const create = (src: string, router: Router<Source>): CallableEventSource => {
  const [path, query] = src.split('?')
  const queryParams = new URLSearchParams(query)
  const route = router.match(path)
  const _source = new CallableEventSource(async function * (this: CallableEventSource) {
    while (true) {
      this.readyState = 1
      // latency
      // await new Promise(resolve => setTimeout(resolve, 5000))
      yield route.route({
        ...{
          offset: parseInt(queryParams.get('offset') || '0'),
        },
        ...route.params,
      }, this)
      if (!isClosed(this)) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  })
  return _source
}
const destroy = (_src: string, source: CallableEventSource) => {
  if (source) {
    source.close()
  }
}

export class DataSourcePool {
  cache: Map<string, unknown> = new Map()
  pool: SharedPool<string, CallableEventSource>
  constructor(requests: Sources) {
    const requestRouter: Router<Source> = new Router(requests)

    this.pool = new SharedPool<string, CallableEventSource>(
      (src: string) => {
        return create(src, requestRouter)
      },
      (src: string, source: CallableEventSource) => {
        return destroy(src, source)
      },
    )
  }

  source(src: string, ref: symbol) {
    return this.open(src, ref)
  }

  cached(src: string) {
    return this.cache.get(src)
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
