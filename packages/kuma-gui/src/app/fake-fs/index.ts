import { mswHandlers } from '@kumahq/fake-api/msw'
import { token } from '@kumahq/kontainer'

import type { EndpointDependencies, FS } from '@/test-support'
import { dependencies } from '@/test-support'
import type { ServiceDefinition, Token } from '@kumahq/kontainer'

const $ = {
  fakeFS: token<FS>('fake.fs'),
  dependencies: token<EndpointDependencies>('dependencies'),
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
  [token('fake.msw.handlers'), {
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
