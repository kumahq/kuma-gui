import type { useApp } from '../index'
import type { DataSourcePool } from '@/app/application/services/data-source/DataSourcePool'
import type DataSourceLifeCycle from '@/app/application/services/data-source/index'
import type { getNavItems } from '@/app/getNavItems'
import type { SplitRouteRecordRaw } from '@/app/meshes'
import Env, { EnvVars } from '@/services/env/Env'
import type I18n from '@/services/i18n/I18n'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { RestClient } from '@/services/kuma-api/RestClient'
import type Logger from '@/services/logger/Logger'
import type { Alias } from '@/services/utils'
import { token } from '@/services/utils'
import type { State } from '@/store/storeConfig'
import type { Router, RouteRecordRaw, NavigationGuard } from 'vue-router'
import type { Store } from 'vuex'

export const TOKENS = {
  EnvVars: token<EnvVars>('EnvVars'),
  Env: token<Env>('Env'),
  env: token<Alias<Env['var']>>('env'),
  components: token('vue.components'),

  kumaEnUs: token('kuma.locale.enUs'),

  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
  dataSourcePool: token<DataSourcePool>('DataSourcePool'),
  dataSourceLifecycle: token<typeof DataSourceLifeCycle>('DataSourceLifecycle'),
  getDataSourceCacheKeyPrefix: token<() => string>('getDataSourceCacheKeyPrefix'),
  sources: token('sources'),

  store: token<Store<State>>('store'),

  router: token<Router>('router'),
  routes: token<RouteRecordRaw[]>('vue.routes'),
  routesLabel: token<RouteRecordRaw[]>('vue.routes.label'),
  navigationGuards: token<NavigationGuard[]>('vue.routes.navigation.guards'),
  guards: token<NavigationGuard[]>('app.guards'),

  meshRoutes: token<RouteRecordRaw[]>('kuma.mesh.routes'),

  dataplaneRoutes: token<SplitRouteRecordRaw[]>('kuma.dataplane.routes'),
  gatewayRoutes: token<SplitRouteRecordRaw[]>('kuma.gateway.routes'),
  serviceRoutes: token<SplitRouteRecordRaw[]>('kuma.service.routes'),
  policyRoutes: token<SplitRouteRecordRaw[]>('kuma.policy.routes'),

  zoneRoutes: token<RouteRecordRaw[]>('kuma.zone.routes'),

  nav: token<ReturnType<typeof getNavItems>>('nav'),

  logger: token<Logger>('logger'),

  app: token<ReturnType<typeof useApp>>('app'),
}
