import CallableEventSource, { isClosed } from './CallableEventSource'
import Router from './Router'
import SharedPool from './SharedPool'

export type DataSourceResponse<T> = {data: T | undefined, error: Error | undefined, refresh: () => void}
export type Source = (params: Record<string, unknown>, source: {close: () => void}) => Promise<unknown>
export type Sources = Record<string, Source>

const get = (src: string, router: Router<Source>) => {
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
  return _source as EventSource
}
const destroy = (_src: string, source: EventSource) => {
  if (source) {
    source.close()
  }
}

export class DataSourcePool {
  cache: Map<string, unknown> = new Map()
  pool: SharedPool<string, EventSource>
  constructor(requests: Sources) {
    const requestRouter: Router<Source> = new Router(requests)

    this.pool = new SharedPool<string, EventSource>(
      (src: string) => {
        return get(src, requestRouter)
      },
      (src: string, source: EventSource) => {
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

  open(src: string, ref: symbol): EventSource | undefined {
    const _source = this.pool.acquire(src, ref)
    if (typeof _source !== 'undefined') {
      // _source.open();
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
    }
    return _source
  }

  close(src: string, ref: symbol) {
    return this.pool.release(src, ref)
  }
}
