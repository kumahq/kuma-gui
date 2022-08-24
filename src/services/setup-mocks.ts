import { MockedRequest } from 'msw'

import { worker as setupWorker } from './mocks'

/**
 * Sets up the msw-based mock server.
 */
export function setupMocks(url: string): void {
  const worker = setupWorker(url)

  console.warn(
    '%c ✨You are mocking api requests.',
    'background: gray; color: white; display: block; padding: 0.25rem;',
  )

  worker.start({
    onUnhandledRequest(req: MockedRequest) {
      if (
        // to do not inform us about not handled XHRs which are conneceted to resources
        req.url.pathname.startsWith('/fonts') ||
        req.url.pathname.startsWith('/img') ||
        req.url.pathname.startsWith('/js')
      ) {
        return
      }

      console.info('Found an unhandled %s request to %s', req.method, req.url.href)
    },
  })
}
