import { setupWorker, MockedRequest } from 'msw'

import Logger from './logger/Logger'
import debugI18n from '@/app/application/services/i18n/DebugI18n'
import { TOKENS as CONTROL_PLANES } from '@/app/control-planes'
import cookied from '@/services/env/CookiedEnv'
import type Env from '@/services/env/Env'
import type { ServiceConfigurator, Token, TokenType } from '@/services/utils'
import { token, get } from '@/services/utils'
import type { FS } from '@/test-support'
import { fakeApi } from '@/test-support'
import { fs } from '@/test-support/mocks/fs'

export { constant, get, container, createInjections, build, merge } from './utils'

type Msw = {
  listen: () => void
  resetHandlers: () => void
  close: () => void
} & ReturnType<typeof setupWorker>
type I18n = ReturnType<typeof debugI18n>
type Sources = TokenType<typeof CONTROL_PLANES.sources>
type AEnv = Env['var']

const $ = {
  msw: token<Promise<Msw>>('msw'),
  fakeFS: token<FS>('fake.fs'),
  kumaFS: token<FS>('fake.fs.kuma'),
  controlPlaneSources: CONTROL_PLANES.sources,
}

type SupportedTokens = typeof $ & {
  i18n: Token
  logger: Token
  env: Token<AEnv>
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
          await get($.msw)
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

  [token<AEnv>('env.debug'), {
    service: (env: () => AEnv) => {
      return cookied(env())
    },
    decorates: app.env,
  }],

  [token<Logger>('logger'), {
    service: Logger,
    decorates: app.logger,
  }],

  // Mock Service Worker
  [$.msw, {
    service: (env: TokenType<typeof app.env>, fs: FS) => {
      const handlers = fakeApi(env, fs)
      const worker = setupWorker(...handlers('*'))

      console.warn(
        '%c ✨You are mocking api requests.',
        'background: gray; color: white; display: block; padding: 0.25rem;',
      )

      return worker.start({
        quiet: true,
        onUnhandledRequest(req: MockedRequest) {
          // Ignores warnings about unhandled requests.
          if (
            req.url.pathname.startsWith('/@fs') ||
            req.url.pathname.startsWith('/node_modules') ||
            req.url.pathname.startsWith('/src/assets') ||
            req.url.href.match(/\.(vue|ts|js|json)(\?.*)?$/)
          ) {
            return
          }

          console.warn('Found an unhandled %s request to %s', req.method, req.url.href)
        },
      })
    },
    arguments: [
      app.env,
      $.fakeFS,
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
