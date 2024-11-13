type HistoryEntry = {
  url: URL
  request: {
    method: string
    body: Record<string, unknown>
  }
}
type Request = {
  url: string
  method: string
  searchParams: Record<string, string>
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
          return item.url.pathname === String(value)
        case 'method':
          return item.request.method === String(value)
        case 'body': {
          return (function loop(request: Record<string, unknown>, item: Record<string, unknown>): boolean {
            return Object.entries(request).every(([prop]) => {
              const req = request[prop] ?? {}
              const entry = item[prop] ?? {}
              if (req.constructor === Object && Object.keys(req).length > 0) {
                return loop(req as Record<string, unknown>, entry as Record<string, unknown>)
              }
              return item[prop] === (item[prop] !== null ? String(request[prop]) : request[prop])
            })
          })(request.body, item.request.body)
        }
        case 'searchParams':
          return Object.entries(request[key]).every(([name, param]) => {
            const actual = item.url.searchParams.getAll(name)
            // convert input to an array
            const expected = Array.isArray(param) ? param : [param]
            return expected.every((item) => {
              return actual.includes(String(item)) === true
            })
          })
        default:
          return false
      }
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
      const found = listeners.filter((item) => equals(item.request, request))
      if (found.length > 0) {
        found.forEach((item) => item.resolve(true))
      }
      history.push(request)
    },
    waitForRequest: async (request: Request, options: { timeout?: number} = {}) => {
      const found = history.find((item) => equals(request, item))
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
