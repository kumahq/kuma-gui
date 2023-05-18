import { RouteRecordRaw } from 'vue-router'
import { createStore, StoreOptions, Store } from 'vuex'

import { useApp, useBootstrap } from '../index'
import { getNavItems } from '@/app/getNavItems'
import i18nEnUs from '@/locales/en-us'
import { createRouter } from '@/router/router'
import routes from '@/router/routes'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import I18n from '@/services/i18n/I18n'
import KumaApi from '@/services/kuma-api/KumaApi'
import Logger from '@/services/logger/DatadogLogger'
import { token, get } from '@/services/utils'
import type { Alias, ServiceConfigurator } from '@/services/utils'
import { storeConfig, State } from '@/store/storeConfig'
import { useGetGlobalKdsAddress } from '@/utilities/useGetGlobalKdsAddress'
import type {
  Router,
} from 'vue-router'

const $ = {
  EnvVars: token<EnvVars>('EnvVars'),
  Env: token<Env>('Env'),
  env: token<Alias<Env['var']>>('env'),

  i18n: token<ReturnType<typeof I18n>>('i18n'),
  enUs: token('i18n.locale.enUs'),
  kumaEnUs: token('kuma.locale.enUs'),

  api: token<KumaApi>('KumaApi'),

  storeConfig: token<StoreOptions<State>>('storeOptions'),
  store: token<Store<State>>('store'),

  router: token<Router>('router'),
  routes: token<RouteRecordRaw[]>('routes'),
  nav: token<typeof getNavItems>('nav'),

  logger: token<Logger>('logger'),

  app: token<ReturnType<typeof useApp>>('app'),
  bootstrap: token<ReturnType<typeof useBootstrap>>('bootstrap'),

  getGlobalKdsAddress: token<ReturnType<typeof useGetGlobalKdsAddress>>('getGlobalKdsAddress'),
}
type SupportedTokens = typeof $
export const services: ServiceConfigurator<SupportedTokens> = ($) => [
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
      KUMA_ZONE_CREATION_FLOW: import.meta.env.VITE_ZONE_CREATION_FLOW,
    } as EnvArgs,
  }],
  [$.Env, {
    service: Env,
    arguments: [
      $.EnvVars,
    ],
  }],
  [$.env, {
    service: (): Alias<Env['var']> => (...rest) => get($.Env).var(...rest),
  }],

  [$.i18n, {
    service: I18n,
    arguments: [
      $.enUs,
    ],
  }],
  [$.kumaEnUs, {
    constant: i18nEnUs,
    labels: [
      $.enUs,
    ],
  }],

  // KumaAPI
  [$.api, {
    service: KumaApi,
    arguments: [
      $.env,
    ],
  }],

  // Logger
  [$.logger, {
    service: Logger,
    arguments: [
      $.env,
    ],
  }],

  // Store
  [$.storeConfig, {
    service: storeConfig,
    arguments: [
      $.api,
    ],
  }],
  [$.store, {
    service: createStore,
    arguments: [
      $.storeConfig,
    ],
  }],

  // Router
  [$.router, {
    service: createRouter,
    arguments: [
      $.routes,
      $.store,
    ],
  }],

  // Routes
  [$.routes, {
    service: routes,
    arguments: [
      $.store,
      $.Env,
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
      $.api,
      $.store,
    ],
  }],

  [$.getGlobalKdsAddress, {
    service: useGetGlobalKdsAddress,
  }],
]

export const TOKENS = $
