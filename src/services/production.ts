import { RouteRecordRaw } from 'vue-router'
import { createStore, StoreOptions, Store } from 'vuex'

import { token, build, ServiceDefinition } from './utils'
import { useApp, useBootstrap } from '../index'
import { getNavItems } from '@/app/getNavItems'
import routes from '@/router/routes'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import KumaApi from '@/services/kuma-api/KumaApi'
import Logger from '@/services/logger/DatadogLogger'
import { storeConfig, State } from '@/store/storeConfig'

const $ = {
  EnvVars: token<EnvVars>('EnvVars'),
  Env: token<Env>('Env'),
  env: token<(key: keyof EnvVars) => string>('env'),

  kumaApi: token<KumaApi>('KumaApi'),

  storeConfig: token<StoreOptions<State>>('storeOptions'),
  store: token<Store<State>>('store'),

  routes: token<RouteRecordRaw[]>('routes'),
  nav: token<typeof getNavItems>('nav'),

  logger: token<Logger>('logger'),

  app: token<ReturnType<typeof useApp>>('app'),
  bootstrap: token<ReturnType<typeof useBootstrap>>('bootstrap'),
}

export const services: ServiceDefinition[] = [
  // Env
  [$.EnvVars, {
    constant: {
      KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
      KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
      KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
      KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
      KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
      KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
      KUMA_MOCK_API_ENABLED: import.meta.env.VITE_MOCK_API_ENABLED,
    } as EnvArgs,
  }],
  [$.Env, {
    service: Env,
    arguments: [
      $.EnvVars,
    ],
  }],
  [$.env, {
    service: (env: Env) => (key: keyof EnvVars) => env.var(key),
    arguments: [
      $.Env,
    ],
  }],

  // KumaAPI
  [$.kumaApi, {
    service: KumaApi,
    arguments: [
      $.Env,
    ],
  }],

  // Logger
  [$.logger, {
    service: Logger,
    arguments: [
      $.Env,
    ],
  }],

  // Store
  [$.storeConfig, {
    service: storeConfig,
    arguments: [
      $.kumaApi,
    ],
  }],
  [$.store, {
    service: createStore,
    arguments: [
      $.storeConfig,
    ],
  }],

  // Routes
  [$.routes, {
    service: routes,
    arguments: [
      $.store,
    ],
  }],
  // Nav
  [$.nav, {
    service: () => (multizone: boolean, hasMeshes: boolean) => getNavItems(multizone, hasMeshes),
  }],

  // App
  [$.app, {
    service: useApp,
    arguments: [
      $.env,
      $.routes,
      $.store,
    ],
  }],
  [$.bootstrap, {
    service: useBootstrap,
    arguments: [
      $.logger,
      $.kumaApi,
      $.store,
    ],
  }],
]

build(services)

export const TOKENS = $
