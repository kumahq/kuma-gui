import { createMockedRestClient } from './kuma-api/RestClient'
import { TOKENS as $, services as prodServices } from './production'
import { merge, build, ServiceDefinition } from './utils'
import { mocks, setupHandlers } from '@/api/mocks'
import CookiedEnv from '@/services/env/CookiedEnv'
import KumaApi from '@/services/kuma-api/KumaApi'
import Logger from '@/services/logger/DatadogLogger'
import { disabledLogger } from '@/services/logger/DisabledLogger'

export { constant, get, container, createInjections, build, merge } from './utils'
export { TOKENS } from './production'

export const services: ServiceDefinition[] = merge(prodServices, [
  [$.Env, {
    service: CookiedEnv,
    arguments: [
      $.EnvVars,
    ],
  }],
  [$.kumaApiRestClient, {
    service: createMockedRestClient(mocks, setupHandlers),
    arguments: [
      $.Env,
    ],
  }],
  [$.kumaApi, {
    service: KumaApi,
    arguments: [
      $.kumaApiRestClient,
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
