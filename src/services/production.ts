import { createStore } from 'vuex'

import { service, constant, get, injected } from './utils'
import { useApp, useBootstrap } from '../index'
import type { Mocks } from '@/api/mocks'
import { getNavItems } from '@/app/getNavItems'
import routes from '@/router/routes'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import KumaApi from '@/services/kuma-api/KumaApi'
import Logger from '@/services/logger/DatadogLogger'
import { storeConfig, State } from '@/store/storeConfig'

export const TOKENS = {
  EnvVars: constant({
    KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
    KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
    KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
    KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
    KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
    KUMA_MOCK_API_ENABLED: import.meta.env.VITE_MOCK_API_ENABLED,
  } as EnvArgs, { description: 'EnvVars' }),
  mocks: constant([] as Mocks, { description: 'mocks' }),

  Env: service(Env, { description: 'Env' }),
  env: service(() => (key: keyof EnvVars) => get(TOKENS.Env).var(key), { description: 'env' }),
  api: service(KumaApi, { description: 'api' }),
  storeConfig: service(storeConfig, { description: 'storeConfig' }),
  store: service(createStore<State>, { description: 'store' }),
  nav: service(() => (multizone: boolean, hasMeshes: boolean) => getNavItems(multizone, hasMeshes), { description: 'nav' }),
  routes: service(routes, { description: 'routes' }),
  logger: service(Logger, { description: 'logger' }),
  app: service(useApp, { description: 'app' }),
  bootstrap: service(useBootstrap, { description: 'bootstrap' }),
}

injected(Env, TOKENS.EnvVars)
injected(KumaApi, TOKENS.Env)
injected(storeConfig, TOKENS.api)
injected(createStore<State>, TOKENS.storeConfig)
injected(routes, TOKENS.store)
injected(Logger, TOKENS.Env)
injected(useApp, TOKENS.env, TOKENS.routes, TOKENS.store)
injected(useBootstrap, TOKENS.logger, TOKENS.api, TOKENS.store)
