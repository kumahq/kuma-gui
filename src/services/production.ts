import {
  RouteRecordRaw,
  NavigationGuard,
  createRouter,
  createWebHistory,
} from 'vue-router'
import { createStore, StoreOptions, Store } from 'vuex'

import createDisabledLogger from './logger/DisabledLogger'
import { useApp, useBootstrap } from '../index'
import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { DataSourcePool } from '@/app/application/services/data-source/DataSourcePool'
import DataSourceLifeCycle from '@/app/application/services/data-source/index'
import { routes as dataplaneRoutes, services as dataplanes } from '@/app/data-planes'
import { routes as diagnosticsRoutes, services as diagnosticsModule } from '@/app/diagnostics'
import { routes as gatewayRoutes, services as gateways } from '@/app/gateways'
import { getNavItems } from '@/app/getNavItems'
import { services as mainOverviewModule } from '@/app/main-overview'
import type { SplitRouteRecordRaw } from '@/app/meshes'
import { routes as meshRoutes, services as meshes } from '@/app/meshes'
import { routes as onboardingRoutes, services as onboarding } from '@/app/onboarding'
import { routes as policyRoutes, services as policies } from '@/app/policies'
import { routes as serviceRoutes, services as servicesModule } from '@/app/services'
import { routes as zoneRoutes, actions as zoneActionRoutes, services as zonesModule } from '@/app/zones'
import i18nEnUs from '@/locales/en-us'
import routes from '@/router/routes'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import I18n from '@/services/i18n/I18n'
import KumaApi from '@/services/kuma-api/KumaApi'
import { RestClient } from '@/services/kuma-api/RestClient'
import Logger from '@/services/logger/Logger'
import type { Alias, ServiceConfigurator } from '@/services/utils'
import { token, get, constant } from '@/services/utils'
import { storeConfig, State } from '@/store/storeConfig'
import type {
  Router,
} from 'vue-router'

const $ = {
  ...APPLICATION,
  EnvVars: token<EnvVars>('EnvVars'),
  Env: token<Env>('Env'),
  env: token<Alias<Env['var']>>('env'),

  i18n: token<ReturnType<typeof I18n>>('i18n'),
  enUs: token('i18n.locale.enUs'),
  kumaEnUs: token('kuma.locale.enUs'),

  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
  getDataSourceCacheKeyPrefix: token<() => string>('getDataSourceCacheKeyPrefix'),
  dataSourcePool: token<DataSourcePool>('DataSourcePool'),
  dataSourceLifecycle: token<typeof DataSourceLifeCycle>('DataSourceLifecycle'),
  sources: token('sources'),

  storeConfig: token<StoreOptions<State>>('storeOptions'),
  store: token<Store<State>>('store'),

  router: token<Router>('router'),
  routes: token<RouteRecordRaw[]>('vue.routes'),
  navigationGuards: token<NavigationGuard[]>('vue.routes.navigation.guards'),

  meshRoutes: token<RouteRecordRaw[]>('kuma.mesh.routes'),

  dataplaneRoutes: token<SplitRouteRecordRaw[]>('kuma.dataplane.routes'),
  gatewayRoutes: token<SplitRouteRecordRaw[]>('kuma.gateway.routes'),
  serviceRoutes: token<SplitRouteRecordRaw[]>('kuma.service.routes'),
  policyRoutes: token<SplitRouteRecordRaw[]>('kuma.policy.routes'),

  zoneRoutes: token<RouteRecordRaw[]>('kuma.zone.routes'),

  diagnosticsRoutes: token<RouteRecordRaw[]>('kuma.diagnostics.routes'),
  onboardingRoutes: token<RouteRecordRaw[]>('kuma.onboarding.routes'),
  onboardingRouteGuards: token<NavigationGuard[]>('kuma.onboarding.routes'),

  nav: token<typeof getNavItems>('nav'),

  logger: token<Logger>('logger'),

  app: token<ReturnType<typeof useApp>>('app'),
  bootstrap: token<ReturnType<typeof useBootstrap>>('bootstrap'),
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
      $.env,
    ],
  }],
  [$.kumaEnUs, {
    constant: i18nEnUs,
    labels: [
      $.enUs,
    ],
  }],

  // KumaAPI
  [$.httpClient, {
    service: RestClient,
    arguments: [
      $.env,
    ],
  }],
  [$.dataSourceLifecycle, {
    constant: DataSourceLifeCycle,
  }],
  [$.getDataSourceCacheKeyPrefix, {
    service: () => () => '',
    arguments: [
      $.router,
    ],
  }],
  [$.dataSourcePool, {
    service: DataSourcePool,
    arguments: [
      $.sources,
      $.dataSourceLifecycle,
      $.getDataSourceCacheKeyPrefix,
    ],
  }],
  [$.api, {
    service: KumaApi,
    arguments: [
      $.httpClient,
      $.env,
    ],
  }],

  // Logger
  [$.logger, {
    service: createDisabledLogger,
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
    service: (env: Alias<Env['var']>, routes: RouteRecordRaw[], guards: NavigationGuard[]) => {
      const router = createRouter({
        history: createWebHistory(env('KUMA_BASE_PATH')),
        routes,
      })

      guards.forEach((item) => {
        router.beforeEach(item)
      })

      return router
    },
    arguments: [
      $.env,
      $.routes,
      $.navigationGuards,
    ],
  }],
  // Nav
  [$.nav, {
    service: () => (multizone: boolean) => getNavItems(multizone),
  }],

  // App
  [$.app, {
    service: useApp,
    arguments: [
      $.store,
      $.router,
    ],
  }],
  [$.bootstrap, {
    service: useBootstrap,
    arguments: [
      $.store,
    ],
  }],

  // Routes
  [$.routes, {
    service: routes,
    arguments: [
      $.zoneRoutes,
      $.meshRoutes,
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

  [$.onboardingRoutes, {
    service: onboardingRoutes,
  }],
  [$.diagnosticsRoutes, {
    service: diagnosticsRoutes,
  }],

  // Modules
  ...application($),
  ...mainOverviewModule($),
  ...zonesModule($),
  ...meshes($),
  ...servicesModule($),
  ...dataplanes($),
  ...gateways($),
  ...policies($),
  ...diagnosticsModule($),
  ...onboarding($),
]

export const TOKENS = $
