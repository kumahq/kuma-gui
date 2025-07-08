import { token } from '@kumahq/kontainer'

import { fs } from '@/test-support/mocks/fs'
import type { ServiceDefinition, Token } from '@kumahq/kontainer'

const $ = {
  kumaFS: token<typeof fs>('fake.fs.kuma'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [$.kumaFS, {
    constant: fs,
    labels: [
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
