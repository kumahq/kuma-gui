import { setupWorker, MockedRequest, RestHandler, SetupWorker } from 'msw'

let mockWorker: SetupWorker | undefined

/**
 * Keeps track of handlers per API.
 */
const handlersMap = new Map<string, RestHandler[]>()

/**
 * Sets up the msw-based mock server.
 */
export function setupMockWorker(apiName: string, handlers: RestHandler[] = []) {
  handlersMap.set(apiName, handlers)

  const allHandlers = Array.from(handlersMap.values()).flat()
  // Stops an existing service worker so new listeners are being registered. The warning this causes in the dev tools console does **NOT** seem to be accurate.
  mockWorker?.stop()
  mockWorker = setupWorker(...allHandlers)

  console.warn(
    `%c ✨You are mocking ${apiName} requests.`,
    'background: gray; color: white; display: block; padding: 0.25rem;',
  )

  mockWorker.start({
    quiet: true,
    onUnhandledRequest(req: MockedRequest) {
      // Ignores warnings about unhandled requests.
      if (
        req.url.pathname.startsWith('/node_modules') ||
        req.url.pathname.startsWith('/src/assets') ||
        req.url.href.match(/\.(vue|ts|js|json)(\?.*)?$/)
      ) {
        return
      }

      console.warn('Found an unhandled %s request to %s', req.method, req.url.href)
    },
  })
}
