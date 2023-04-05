import { setupWorker, RestHandler, MockedRequest } from 'msw'

import { TOKENS as PROD_TOKENS, services as prodServices } from './production'
import { merge, build, ServiceDefinition, token, get } from './utils'
import { useBootstrap } from '../index'
import CookiedEnv from '@/services/env/CookiedEnv'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'
import type { TokenType } from '@/services/utils'
import type { FS, FakeEndpoint } from '@/test-support/fake'
import { fakeApi } from '@/test-support/fake'
import { fs } from '@/test-support/mocks/fs'

export { constant, get, container, createInjections, build, merge } from './utils'

type Msw = {
  listen: () => void
  resetHandlers: () => void
  close: () => void
} & ReturnType<typeof setupWorker>

const $ = {
  ...PROD_TOKENS,
  msw: token<Msw>('msw'),
  mswFakeApiHandlers: token<RestHandler[]>('msw.fake.handlers'),
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

  kumaFS: token<Record<string, FakeEndpoint>>('fake.fs.kuma'),
}

export const services: ServiceDefinition[] = [

  [$.Env, {
    service: CookiedEnv,
    arguments: [
      $.EnvVars,
    ],
  }],

  [$.logger, {
    service: disabledLogger(Logger),
    arguments: [
      $.Env,
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
    },
    arguments: [
      $.mswHandlers,
    ],
  }],
  [$.mswFakeApiHandlers, {
    service: (env: TokenType<typeof $.env>, fs: FS) => fakeApi(env, fs),
    arguments: [
      $.env,
      $.fakeFS,
    ],
    labels: [
      $.mswHandlers,
    ],
  }],

  // new style kuma mocks
  [$.kumaFS, {
    constant: fs,
    arguments: [
      $.Env,
    ],
    labels: [
      $.fakeFS,
    ],
  }],
]

// straight-forwards bootstrap decorator
const bootstrap = prodServices.find(([token, _]) => token === $.bootstrap)
if (bootstrap) {
  bootstrap[1].service = (...rest: Parameters<typeof useBootstrap>) => {
    const env = get($.Env)
    if (env.var('KUMA_MOCK_API_ENABLED') === 'true') {
      // this initialises MSW
      get($.msw)
    }
    return useBootstrap(...rest)
  }
}
build(merge(prodServices, services))
export const TOKENS = $
