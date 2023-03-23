import { setupWorker, RestHandler, MockedRequest } from 'msw'

import { TOKENS as PROD_TOKENS, services as prodServices } from './production'
import { merge, build, ServiceDefinition, token, get } from './utils'
import { useBootstrap } from '../index'
import { mocks, setupHandlers } from '@/api/mocks'
import { fs, fakeApi } from '@/api/mocks/index'
import CookiedEnv from '@/services/env/CookiedEnv'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'
import type { TokenType } from '@/services/utils'

export { constant, get, container, createInjections, build, merge } from './utils'

type Msw = ReturnType<typeof setupWorker>
const $ = {
  ...PROD_TOKENS,
  msw: token<Msw>('msw'),
  mswKumaHandlers: token<RestHandler[]>('msw.kuma.handlers'),
  mswKumaMocks: token<RestHandler[]>('msw.kuma.mocks'),
  mswHandlers: token<RestHandler[]>('msw.handlers'),
}

type Env = TokenType<typeof $.Env>
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

  // old style kuma mocks
  [$.mswKumaMocks, {
    service: (env: Env) => setupHandlers(env.var('KUMA_API_URL'), mocks, env),
    arguments: [
      $.Env,
    ],
    labels: [
      $.mswHandlers,
    ],
  }],

  // new style kuma mocks
  [$.mswKumaHandlers, {
    service: (env: Env) => fakeApi(env.var('KUMA_API_URL'), fs),
    arguments: [
      $.Env,
    ],
    labels: [
      $.mswHandlers,
    ],
  }],
]

// straight-forwards bootstrap decorator
const bootstrap: ServiceDefinition | undefined = prodServices.find(([token, _]) => token === $.bootstrap)
if (bootstrap) {
  bootstrap[1].service = (...rest: Parameters<typeof useBootstrap>) => {
    const env = get($.Env)
    if (env.var('KUMA_MOCK_API_ENABLED') === 'true') {
      get($.msw)
    }
    return useBootstrap(...rest)
  }
}
build(merge(prodServices, services))
export const TOKENS = $
