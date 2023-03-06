import { TOKENS as $, services as prodServices } from './production'
import { constant, merge, build, ServiceDefinition } from './utils'
import { mocks } from '@/api/mocks'
import CookiedEnv from '@/services/env/CookiedEnv'
import KumaApi from '@/services/kuma-api/KumaApi'
import { mockApi } from '@/services/kuma-api/MockKumaApi'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'

export { constant, get, container, createInjections, build, merge } from './utils'
export { TOKENS } from './production'

const MOCKS = constant(mocks, { description: 'mocks' })
export const services: ServiceDefinition[] = merge(prodServices, [
  [$.Env, {
    service: CookiedEnv,
    arguments: [
      $.EnvVars,
    ],
  }],
  [$.api, {
    service: mockApi(KumaApi),
    arguments: [
      $.Env,
      MOCKS,
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
