import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'
import { fs } from '@/test-support/mocks/fs'

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
