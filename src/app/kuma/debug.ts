import type Env from '@/app/application/services/env/Env'
import { TOKENS as CONTROL_PLANES } from '@/app/control-planes'
import type { ServiceDefinition, Token, TokenType } from '@/services/utils'
import { token, get } from '@/services/utils'
import { fs } from '@/test-support/mocks/fs'

type Sources = TokenType<typeof CONTROL_PLANES.sources>

const $ = {
  controlPlaneSources: CONTROL_PLANES.sources,
  kumaFS: token<typeof fs>('fake.fs.kuma'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('control-planes.sources.with.mockServer'), {
    service: (target: () => Sources) => {
      const sources = target()
      const p = sources['/control-plane/addresses']

      sources['/control-plane/addresses'] = async (...args) => {
        const result = p(...args)
        const env = get(app.env) as Env['var']
        if (env('KUMA_MOCK_API_ENABLED', 'true') === 'true') {
          if (!app.msw) {
            throw new Error('an MSW service container service has not been provided')
          }
          await get(app.msw)
        }
        return result
      }
      return sources
    },
    decorates: $.controlPlaneSources,
  }],
  [$.kumaFS, {
    constant: fs,
    labels: [
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
