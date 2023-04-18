import { setupWorker, RestHandler, MockedRequest, rest } from 'msw'

import { ServiceConfigurator, ReturnDecorated, Decorator, token, get } from './utils'
import CookiedEnv from '@/services/env/CookiedEnv'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'
import type { Alias } from '@/services/utils'
import type { FS } from '@/test-support'
import { fakeApi } from '@/test-support'
import { fs } from '@/test-support/mocks/fs'

export { constant, get, container, createInjections, build, merge } from './utils'

type Msw = {
  listen: () => void
  resetHandlers: () => void
  close: () => void
} & ReturnType<typeof setupWorker>

const $ = {
  msw: token<Msw>('msw'),
  /**
   * @description
   * Service Label for labeling MSW handlers for consumption via setupWorker
   */
  mswHandlers: token<RestHandler[]>('msw.handlers'),

  /**
   * @description
   * Service Label for labeling fake FSs for consumption via MSW
   */
  fakeFS: token<FS>('fake.fs'),

  mswFakeApiHandlers: token<RestHandler[]>('msw.fake.handlers'),
  kumaFS: token<FS>('fake.fs.kuma'),
}

export const services: ServiceConfigurator = (app) => [

  [token<Decorator<typeof app.bootstrap>>('bootstrap.with.mockServer'), {
    service: (bootstrap: ReturnDecorated<typeof app.bootstrap>) => {
      const env = get(app.env) as Alias<CookiedEnv['var']>
      if (env('KUMA_MOCK_API_ENABLED') === 'true') {
        get($.msw)
      }
      return bootstrap()
    },
    decorates: app.bootstrap,
  }],

  [app.Env, {
    service: CookiedEnv,
    arguments: [
      app.EnvVars,
    ],
  }],

  [app.logger, {
    service: disabledLogger(Logger),
    arguments: [
      app.Env,
    ],
  }],

  // Mock Service Worker
  [$.msw, {
    service: (handlers: RestHandler[]) => {
      const worker = setupWorker(...handlers)

      console.warn(
        '%c ✨You are mocking api requests.',
        'background: gray; color: white; display: block; padding: 0.25rem;',
      )

      worker.start({
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
      return rest
    },
    arguments: [
      $.mswHandlers,
    ],
  }],
  [$.mswFakeApiHandlers, {
    service: (env: Alias<CookiedEnv['var']>, fs: FS) => fakeApi(env, rest, fs),
    arguments: [
      app.env,
      $.fakeFS,
    ],
    labels: [
      $.mswHandlers,
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
