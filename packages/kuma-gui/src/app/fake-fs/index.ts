import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'
import type { FS } from '@/test-support'
import { mswHandlers } from '@/test-support'

const $ = {
  fakeFS: token<FS>('fake.fs'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('fake.msw.handlers'), {
    service: mswHandlers,
    arguments: [
      app.env,
      $.fakeFS,
    ],
    labels: [
      app.mswHandlers,
    ],
  }],
]
export const TOKENS = $
