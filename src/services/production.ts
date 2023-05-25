import { RouteRecordRaw } from 'vue-router'
import { createStore, StoreOptions, Store } from 'vuex'

import { useApp, useBootstrap } from '../index'
import { routes as dataplaneRoutes } from '@/app/data-planes'
import { routes as diagnosticsRoutes } from '@/app/diagnostics'
import { routes as gatewayRoutes } from '@/app/gateways'
import { getNavItems } from '@/app/getNavItems'
import type { SplitRouteRecordRaw } from '@/app/meshes'
import { routes as meshRoutes } from '@/app/meshes'
import { routes as onboardingRoutes } from '@/app/onboarding'
import { routes as policyRoutes } from '@/app/policies'
import { routes as serviceRoutes } from '@/app/services'
import { routes as wizardRoutes } from '@/app/wizard'
import { routes as zoneRoutes, actions as zoneActionRoutes } from '@/app/zones'
import i18nEnUs from '@/locales/en-us'
import { createRouter } from '@/router/router'
import routes from '@/router/routes'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import I18n from '@/services/i18n/I18n'
import KumaApi from '@/services/kuma-api/KumaApi'
import Logger from '@/services/logger/DatadogLogger'
import type { Alias, ServiceConfigurator } from '@/services/utils'
import { token, get, constant } from '@/services/utils'
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
  routes: token<RouteRecordRaw[]>('vue.routes'),

  meshRoutes: token<RouteRecordRaw[]>('kuma.mesh.routes'),

  dataplaneRoutes: token<SplitRouteRecordRaw[]>('kuma.dataplane.routes'),
  gatewayRoutes: token<SplitRouteRecordRaw[]>('kuma.gateway.routes'),
  serviceRoutes: token<SplitRouteRecordRaw[]>('kuma.service.routes'),
  policyRoutes: token<SplitRouteRecordRaw[]>('kuma.policy.routes'),

  zoneRoutes: token<RouteRecordRaw[]>('kuma.zone.routes'),

  diagnosticsRoutes: token<RouteRecordRaw[]>('kuma.diagnostics.routes'),
  onboardingRoutes: token<RouteRecordRaw[]>('kuma.onboarding.routes'),
  wizardRoutes: token<RouteRecordRaw[]>('kuma.wizard.routes'),

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
      $.zoneRoutes,
      $.meshRoutes,
      $.wizardRoutes,
      $.onboardingRoutes,
      $.diagnosticsRoutes,
    ],
  }],

  [$.meshRoutes, {
    service: meshRoutes,
    arguments: [
      $.serviceRoutes,
      $.gatewayRoutes,
      $.dataplaneRoutes,
      $.policyRoutes,
    ],
  }],

  [$.dataplaneRoutes, {
    service: dataplaneRoutes,
  }],
  [$.gatewayRoutes, {
    service: gatewayRoutes,
  }],
  [$.serviceRoutes, {
    service: serviceRoutes,
  }],
  [$.policyRoutes, {
    service: policyRoutes,
    arguments: [
      $.store,
      $.Env,
    ],
  }],

  [$.zoneRoutes, {
    service: zoneRoutes,
    arguments: [
      constant(
        [...(import.meta.env.VITE_ZONE_CREATION_FLOW === 'enabled' ? zoneActionRoutes() : [])],
        {
          description: 'kuma.zone.action.routes',
        },
      ),
    ],
  }],

  [$.wizardRoutes, {
    service: wizardRoutes,
  }],
  [$.onboardingRoutes, {
    service: onboardingRoutes,
  }],
  [$.diagnosticsRoutes, {
    service: diagnosticsRoutes,
  }],

  // Nav
  [$.nav, {
    service: () => (multizone: boolean) => getNavItems(multizone),
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
