import { describe, expect, test, vi } from 'vitest'

import DataSourcePool from './DataSourcePool'

class DataSourcePoolWithExposedPool extends DataSourcePool {
  get pool() {
    return this._pool
  }
}

class EventSource extends EventTarget {
  constructor(
    public configuration = {},
  ) {
    super()
  }

  open() {}
  close() {}
}
const spyableEventSource = () => {
  const add = vi.fn()
  class EventSourceProxy extends EventSource {
    addEventListener(...args: Parameters<EventTarget['addEventListener']>) {
      switch (args[0]) {
        case 'message':
        case 'error':
          add(args[0], args[2])
          break
      }
      return super.addEventListener(...args)
    }
  }
  return {
    add,
    EventSourceProxy,
  }
}

describe('DataSourcePool', () => {
  test('shared pooling', () => {
    const createCount = vi.fn()
    const destroyCount = vi.fn()
    const data = new DataSourcePool({
      '/one': async () => {},
      '/two': async () => {},
    }, {
      create: (_src: string) => {
        createCount()
        return new EventSource()
      },
      destroy: () => {
        destroyCount()
      },
    })
    // acquire 10 times, with the last one being a different URI
    // they should all be the same instance apart from the last one
    Array.from({ length: 10 }).map((_, i) => i !== 9 ? data.source('/one') : data.source('/two')).reduce((prev, item, i) => {
      const isSame = i !== 9
      expect(prev === item).toBe(isSame)
      return item
    }, data.source('/one'))
    data.destroy()

    expect(createCount).toHaveBeenCalledTimes(2)
    expect(destroyCount).toHaveBeenCalledTimes(2)
  })

  test('event registration', () => {
    const { EventSourceProxy, add } = spyableEventSource()

    const source = new EventSourceProxy()

    const data = new DataSourcePoolWithExposedPool({
      '/one': async () => {},
    }, {
      create: (_src: string) => {
        return source
      },
    })
    // acquire 10 times, they all use the same ref so they are exactly the same object
    // and we only add one EventSource into the pool
    const ref = Symbol('')
    Array.from({ length: 10 }).map(() => data.source('/one', ref))

    const controller = data.pool.acquire('/one', ref).controller
    const abort = vi.spyOn(controller, 'abort')

    // close the source with one call as we only added one EventSource to the pool
    data.close('/one', ref)

    expect(abort).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledTimes(2)
    expect(add).toHaveBeenCalledWith('message', { signal: controller.signal })
    expect(add).toHaveBeenCalledWith('error', { signal: controller.signal })

    data.destroy()
  })
  test('cacheControl: ""', async () => {
    const { EventSourceProxy, add } = spyableEventSource()

    const source = new EventSourceProxy()

    const data = new DataSourcePoolWithExposedPool({
      '/one': async () => {},
    }, {
      create: (_src: string) => {
        return source
      },
    })

    const ref = Symbol('')
    data.source('/one', ref)

    // fill the cache with something once the pool is looking after it
    source.dispatchEvent(new MessageEvent('message', { data: 'hello' }))

    const controller = data.pool.acquire('/one', ref).controller
    const abort = vi.spyOn(controller, 'abort')

    // make sure we wait for the first cache to fire before we spy on it
    await Promise.resolve()
    const dispatch = vi.spyOn(source, 'dispatchEvent')

    // close the source with one call as we only added one EventSource to the pool
    data.close('/one', ref)

    // this is the one we are actually spying on the cache for
    data.source('/one', ref)
    data.close('/one', ref)

    // we only set up the spy for one abort
    expect(abort).toHaveBeenCalledTimes(1)
    // but we still expect add to be called twice for each message and error, making 4
    expect(add).toHaveBeenCalledTimes(4)
    expect(add).toHaveBeenCalledWith('message', { signal: controller.signal })
    expect(add).toHaveBeenCalledWith('error', { signal: controller.signal })
    // wait for the tick before checking dispatch
    await Promise.resolve()
    expect(dispatch).toHaveBeenCalledTimes(1)

    data.destroy()
  })
  test('cacheControl: no-cache', async () => {
    const { EventSourceProxy, add } = spyableEventSource()

    const source = new EventSourceProxy({
      cacheControl: 'no-cache',
    })

    const data = new DataSourcePoolWithExposedPool({
      '/one': async () => {},
    }, {
      create: (_src: string) => {
        return source
      },
    })

    const ref = Symbol('')
    data.source('/one', ref)

    // fill the cache with something once the pool is looking after it
    source.dispatchEvent(new MessageEvent('message', { data: 'hello' }))

    const controller = data.pool.acquire('/one', ref).controller
    const abort = vi.spyOn(controller, 'abort')

    // make sure we wait for the first cache to fire before we spy on it
    await Promise.resolve()
    const dispatch = vi.spyOn(source, 'dispatchEvent')

    // close the source with one call as we only added one EventSource to the pool
    data.close('/one', ref)

    // this is the one we are actually spying on the cache for
    data.source('/one', ref)
    data.close('/one', ref)

    // we only set up the spy for one abort
    expect(abort).toHaveBeenCalledTimes(1)
    // but we still expect add to be called twice for each message and error, making 4
    expect(add).toHaveBeenCalledTimes(4)
    expect(add).toHaveBeenCalledWith('message', { signal: controller.signal })
    expect(add).toHaveBeenCalledWith('error', { signal: controller.signal })
    // wait for the tick before checking dispatch
    await Promise.resolve()
    expect(dispatch).toHaveBeenCalledTimes(0)

    data.destroy()
  })
  test('cacheControl: no-store', () => {
    const { EventSourceProxy, add } = spyableEventSource()

    const source = new EventSourceProxy({
      cacheControl: 'no-store',
    })

    const data = new DataSourcePoolWithExposedPool({
      '/one': async () => {
        return true
      },
    }, {
      create: (_src: string) => {
        return source
      },
    })
    // acquire 10 times, they all use the same ref so they are exactly the same object
    // and we only add one EventSource into the pool
    const ref = Symbol('')
    Array.from({ length: 10 }).map(() => data.source('/one', ref))

    const controller = data.pool.acquire('/one', ref).controller
    const abort = vi.spyOn(controller, 'abort')

    // close the source with one call as we only added one EventSource to the pool
    data.close('/one', ref)

    expect(abort).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledTimes(1)
    expect(add).not.toHaveBeenCalledWith('message', { signal: controller.signal })
    expect(add).toHaveBeenCalledWith('error', { signal: controller.signal })

    data.destroy()
  })
})
