import { token } from '@kumahq/container'
import { mswHandlers } from '@kumahq/fake-api/msw'
import { dependencies } from '@kumahq/kuma-http-api/mocks'

import type { ServiceDefinition, Token } from '@kumahq/container'

const $ = {
  fakeFS: token('fake-api.label.fs'),
  dependencies: token<typeof dependencies>('fake-api.dependencies'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [$.dependencies, {
    service: (env) => ({
      ...dependencies,
      env,
    }),
    arguments: [
      app.env,
    ],
  }],
  [token('fake-api.msw.handlers'), {
    service: mswHandlers,
    arguments: [
      $.fakeFS,
      $.dependencies,
    ],
    labels: [
      app.mswHandlers,
    ],
  }],
]
export const TOKENS = $
