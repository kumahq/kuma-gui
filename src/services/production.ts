import {
  RouteRecordRaw,
  NavigationGuard,
  createRouter,
  createWebHistory,
} from 'vue-router'
import { createStore } from 'vuex'

import createDisabledLogger from './logger/DisabledLogger'
import { TOKENS as _TOKENS } from './tokens'
import { useApp } from '../index'
import { services as application, TOKENS as APPLICATION } from '@/app/application'
import type { Can } from '@/app/application/services/can'
import { DataSourcePool } from '@/app/application/services/data-source/DataSourcePool'
import DataSourceLifeCycle from '@/app/application/services/data-source/index'
import { routes as dataplaneRoutes, services as dataplanes } from '@/app/data-planes'
import { routes as gatewayRoutes, services as gateways } from '@/app/gateways'
import { getNavItems } from '@/app/getNavItems'
import { services as mainOverviewModule } from '@/app/main-overview'
import { routes as meshRoutes, services as meshes } from '@/app/meshes'
import { routes as policyRoutes, services as policies } from '@/app/policies'
import { routes as serviceRoutes, services as servicesModule } from '@/app/services'
import { routes as zoneRoutes, actions as zoneActionRoutes, services as zonesModule } from '@/app/zones'
import i18nEnUs from '@/locales/en-us'
import routes from '@/router/routes'
import Env, { EnvArgs } from '@/services/env/Env'
import KumaApi from '@/services/kuma-api/KumaApi'
import { RestClient } from '@/services/kuma-api/RestClient'
import type { Alias, ServiceConfigurator } from '@/services/utils'
import { get, constant } from '@/services/utils'
import { storeConfig } from '@/store/storeConfig'

const $ = {
  ...APPLICATION,
  ..._TOKENS,
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
  [$.store, {
    service: () => {
      return createStore(storeConfig())
    },
  }],

  // Router
  [$.router, {
    service: (env: Alias<Env['var']>, routes: RouteRecordRaw[], guards: NavigationGuard[]) => {
      const router = createRouter({
        history: createWebHistory(env('KUMA_BASE_PATH')),
        routes,
      })

      guards.forEach((item) => {
        if (typeof item === 'function') {
          router.beforeEach(item)
        }
      })

      return router
    },
    arguments: [
      $.env,
      $.routes,
      $.navigationGuards,
    ],
  }],
  [$.guards, {
    service: () => {
      return []
    },
    labels: [
      $.navigationGuards,
    ],
  }],

  // Nav
  [$.nav, {
    service: (can: Can) => getNavItems(can('use zones')),
    arguments: [
      $.can,
    ],
  }],

  // App
  [$.app, {
    service: useApp,
    arguments: [
      $.store,
      $.router,
      $.components,
    ],
  }],
  // Routes
  [$.routes, {
    service: routes,
    arguments: [
      $.routesLabel,
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
    labels: [
      $.routesLabel,
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
    labels: [
      $.routesLabel,
    ],
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
]

export const TOKENS = $
