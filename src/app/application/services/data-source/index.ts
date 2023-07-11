import CallableEventSource, { isClosed } from './CallableEventSource'
import type { Creator, Destroyer } from './DataSourcePool'

export const create: Creator = (src, router) => {
  const [path, query] = src.split('?')
  const queryParams = new URLSearchParams(query)
  // use the router to find which function to call
  const route = router.match(path)
  const _source = new CallableEventSource(async function * (this: CallableEventSource) {
    while (true) {
      this.readyState = 1
      // `.route` here is the function call to the 'source' i.e. the Promise
      // returning call that can be polled, in our case right now the HTTP
      // calls but in the future could also be 'listeners' on localStorage, or
      // 'listeners' on a session
      yield route.route({
        ...{
          offset: parseInt(queryParams.get('offset') || '0'),
          size: parseInt(queryParams.get('size') || '0'),
          page: parseInt(queryParams.get('page') || '0'),
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
export const destroy: Destroyer = (_src, source) => {
  if (source) {
    source.close()
  }
}

export default {
  create,
  destroy,
}
