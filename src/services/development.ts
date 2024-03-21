import DebugKClipboardProvider from '@/app/application/components/debug-k-clipboard-provider/DebugKClipboardProvider.vue'
import debugI18n from '@/app/application/services/i18n/DebugI18n'
import { TOKENS as CONTROL_PLANES } from '@/app/control-planes'
import cookied from '@/services/env/CookiedEnv'
import type Env from '@/services/env/Env'
import type { ServiceConfigurator, Token, TokenType } from '@/services/utils'
import { token, get } from '@/services/utils'
import type { FS } from '@/test-support'
import { mswHandlers } from '@/test-support'
import { fs } from '@/test-support/mocks/fs'

export { constant, get, container, createInjections, build, merge } from './utils'

type I18n = ReturnType<typeof debugI18n>
type Sources = TokenType<typeof CONTROL_PLANES.sources>

const $ = {
  fakeFS: token<FS>('fake.fs'),
  kumaFS: token<FS>('fake.fs.kuma'),
  controlPlaneSources: CONTROL_PLANES.sources,
}

type SupportedTokens = typeof $ & {
  mswHandlers: Token
  i18n: Token
  components: Token
  env: Token<Env['var']>
} & {
  msw?: Token<Promise<unknown>>
}

export const services: ServiceConfigurator<SupportedTokens> = (app) => [
  [token<Sources>('control-planes.sources.with.mockServer'), {
    service: (target: () => Sources) => {
      const sources = target()
      const p = sources['/control-plane/addresses']

      sources['/control-plane/addresses'] = async (...args) => {
        const result = p(...args)
        const env = get(app.env)
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

  [token<I18n>('i18n.debug'), {
    service: (i18n: () => I18n) => {
      const env = get(app.env)
      // @ts-ignore We don't want TS to show this elsewhere in the application
      // and this is the most straight-forwards way to achieve that right now
      if (env('KUMA_I18N_DEBUG_ENABLED', '').length > 0) {
        return debugI18n(i18n())
      }
      return i18n()
    },
    decorates: app.i18n,
  }],

  [token('development.components'), {
    service: () => {
      return [
        ['KClipboardProvider', DebugKClipboardProvider],
      ]
    },
    labels: [
      app.components,
    ],
  }],

  [token<Env['var']>('env.debug'), {
    service: (env: () => Env['var']) => {
      return cookied(env())
    },
    decorates: app.env,
  }],

  [token('fake.msw.handlers'), {
    service: (env: Env['var'], fs: FS) => {
      return mswHandlers(env, fs)
    },
    arguments: [
      app.env,
      $.fakeFS,
    ],
    labels: [
      app.mswHandlers,
    ],
  }],
  [$.kumaFS, {
    constant: fs,
    labels: [
      $.fakeFS,
    ],
  }],
]
export const TOKENS = $
