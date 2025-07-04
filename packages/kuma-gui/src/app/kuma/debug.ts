import type Env from '@/app/application/services/env/Env'
import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'
import { fs } from '@/test-support/mocks/fs'


const $ = {
  kumaFS: token<typeof fs>('fake.fs.kuma'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [$.kumaFS, {
    service: (env: Env['var']) => {
      // return fs
      const baseURL = env('KUMA_API_URL')
      return Object.fromEntries(Object.entries(fs).map(([route, response]) => {
        return [route.includes('://') ? route : `${baseURL}${route}`, response]
      }))
    },
    arguments: [
      app.env,
    ],
    labels: [
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
