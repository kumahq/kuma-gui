import { setupServer, SetupServer } from 'msw/node'

import { setupHandlers } from './mocks'

/**
 * Sets up a mock server for the use in tests.
 *
 * **IMPORTANT**: Do not import this file in the regular application. Since it imports `msw/node`, this will cause the application to break because it will try to import (require, actually) Node built-ins which aren’t available in browser environments.
 */
export function setupMockServer(url: string = ''): SetupServer {
  return setupServer(...setupHandlers(url))
}
