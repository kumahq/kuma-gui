import { TOKENS as $, services as prodServices } from './production'
import { merge, build } from './utils'
import { mocks, setupHandlers } from '@/api/mocks'
import CookiedEnv from '@/services/env/CookiedEnv'
import KumaApi from '@/services/kuma-api/KumaApi'
import { mockApi } from '@/services/kuma-api/mockApi'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'
export { constant, get, container, createInjections, build, merge } from './utils'
export { TOKENS } from './production'

export const services = merge(prodServices, [
  [$.Env, {
    service: CookiedEnv,
    arguments: [
      $.EnvVars,
    ],
  }],
  [$.kumaApi, {
    service: mockApi(KumaApi, mocks, setupHandlers),
    arguments: [
      $.Env,
    ],
  }],
  [$.logger, {
    service: disabledLogger(Logger),
    arguments: [
      $.Env,
    ],
  }],
])
build(services)
