import { setupWorker, MockedRequest } from 'msw'

import { setupHandlers } from './mocks'

/**
 * Sets up the msw-based mock server.
 */
export function setupMockWorker(url: string): void {
  const worker = setupWorker(...setupHandlers(url))

  console.warn(
    '%c ✨You are mocking api requests.',
    'background: gray; color: white; display: block; padding: 0.25rem;',
  )

  worker.start({
    onUnhandledRequest(req: MockedRequest) {
      // Ignores warnings about unhandled requests.
      if (
        req.url.pathname.startsWith('/src/assets') ||
        req.url.href.endsWith('.json?import') ||
        req.url.href.match(/\.(vue|ts|js)(\?.*)?$/)
      ) {
        return
      }

      console.warn('Found an unhandled %s request to %s', req.method, req.url.href)
    },
  })
}
