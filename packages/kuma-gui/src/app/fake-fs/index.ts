import { mswHandlers } from '@kumahq/fake-api/msw'

import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'
import type { EndpointDependencies, FS } from '@/test-support'
import { dependencies } from '@/test-support'

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
