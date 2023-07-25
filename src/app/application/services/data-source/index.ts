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
      try {
        // `.route` here is the function call to the 'source' i.e. the Promise
        // returning call that can be polled, in our case right now the HTTP
        // calls but in the future could also be 'listeners' on localStorage, or
        // 'listeners' on a session
        yield route.route({
          ...{
            offset: parseInt(queryParams.get('offset') || '0'),
            size: parseInt(queryParams.get('size') || '0'),
            page: parseInt(queryParams.get('page') || '0'),
            search: queryParams.get('search') || '',
          },
          ...route.params,
        }, this)
        // if we get a successful response
        // reset the retry count back to zero
        this.configuration.attempts = 0
        //
        if (!isClosed(this)) {
        // right now any polling has a 5s interval, we currently just hardcode
        // here but if/when we use this more this should be a user setting
        // that we can save/retrieve from localStorage
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      } catch (e) {
        const error = (e as {status: number | undefined})
        if (typeof error.status !== 'undefined') {
          const status = String(error.status)
          switch (true) {
            case status.startsWith('50'): {
              this.configuration.attempts++
              // if we reach the end of attempts
              // 1. close the source entirely
              // 2. reset attempts to zero
              // 3. throw the error to be picked up by the application
              if (this.configuration.attempts > this.configuration.maxAttempts) {
                this.close()
                this.configuration.attempts = 0
                throw e
              }
              const delay = 3000 * Math.pow(this.configuration.attempts, this.configuration.power)
              await new Promise(resolve => setTimeout(resolve, delay))
              break
            }
            default:
              // if we are not a 50x
              // 1. close the source entirely
              // 2. reset attempts to zero
              // 3. throw the error to be picked up by the application
              this.close()
              this.configuration.attempts = 0
              throw e
          }
        } else {
          // if we don't have a status at all
          // 1. close the source entirely
          // 2. reset attempts to zero
          // 3. throw the error to be picked up by the application
          this.close()
          this.configuration.attempts = 0
          throw e
        }
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
