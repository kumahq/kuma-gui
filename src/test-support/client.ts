type HistoryEntry = {
  url: URL
  request: {
    method: string
    body: Record<string, unknown>
  }
}
type Request = {
  url: string,
  method: string,
  searchParams: Record<string, string>,
  body: Record<string, unknown>
}
type Listener = {
  request: Request
  resolve: (bool: boolean) => void
}
const equals = (request: Request, item: HistoryEntry) => {
  return Object.entries(request).every(
    ([key, value]) => {
      switch (key) {
        case 'url':
          return item[key].pathname === String(value)
        case 'method':
          return item.request[key] === String(value)
        case 'body':
          return Object.entries(request[key]).every(([prop, value]) => {
            return item.request[key][prop] === String(value)
          })
        case 'searchParams':
          return Object.entries(request[key]).every(([key, value]) => {
            const actual = item.url.searchParams.getAll(key)
            // convert input to an array
            const expected = Array.isArray(value) ? value : [value]
            return expected.every((item) => {
              return actual.includes(String(item)) === true
            })
          })
      }
      return false
    },
  )
}
export default () => {
  let history: HistoryEntry[] = []
  let listeners: Listener[] = []
  return {
    reset: () => {
      history = []
      listeners = []
    },
    request: (request: HistoryEntry) => {
      const found = listeners.filter((item: Listener) => equals(item.request, request))
      if (found.length > 0) {
        found.forEach((item) => item.resolve(true))
      }
      history.push(request)
    },
    waitForRequest: async (request: Request, options: { timeout?: number} = {}) => {
      const found = history.find((item: HistoryEntry) => equals(request, item))
      if (typeof found !== 'undefined') {
        return true
      } else {
        const p = new Promise((resolve) => {
          setTimeout(
            () => resolve(false),
            options.timeout || 4000,
          )
          listeners.push({
            request,
            resolve,
          })
        })
        return p
      }
    },
  }
}
