import { token, createInjections } from '@kumahq/container'
import { create, destroy, DataSourcePool } from '@kumahq/data'
import Data, { DataLoader, DataSink, DataSource } from '@kumahq/data/vue'
import Routing, { RouteTitle, RouteView } from '@kumahq/routing/vue'
import can from '@kumahq/settings/can'
import env from '@kumahq/settings/env'
import { XEmptyState } from '@kumahq/x'

import AppView from './components/app-view/AppView.vue'
import DataCollection from './components/data-collection/DataCollection.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import I18n from './services/i18n/I18n'
import storage from './services/storage'
import { services as kuma } from '@/app/kuma'
import type { ServiceDefinition } from '@kumahq/container'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export { runInDebug } from './utilities'
export { defineSources, ValidationError, useUri } from '@kumahq/data'
export { useDataSourcePool } from '@kumahq/data/vue'
export type { DataSourceResponse, TypeOf } from '@kumahq/data'

type Sources = ConstructorParameters<typeof DataSourcePool>[0]

type Token = ReturnType<typeof token>

export interface Abilities { }
export type Can = Abilities['can']

export interface Environment { }
export type Env = Environment['env']

declare module '@kumahq/routing' {
  interface Dependencies {
    can: Abilities['can']
    env: Environment['env']
    i18n: {
      t: ReturnType<typeof I18n>['t']
    }
  }
}
declare module 'vue' {
  export interface GlobalComponents {
    AppView: typeof AppView
    DataSource: typeof DataSource
    DataSink: typeof DataSink
    DataLoader: typeof DataLoader
    DataCollection: typeof DataCollection
    RouteView: typeof RouteView
    RouteTitle: typeof RouteTitle
  }
  interface ComponentCustomProperties {
    $routeName?: string
  }
}



// @TODO ideally we don't want people using env defaults in the application, whereas they are needed in mocks
// type EnvKeys = Parameters<Env> extends [infer Key, any?] ? Key : never

const $ = {
  env: token<Env>('application.env'),
  vars: token('application.env.vars'),

  fetch: token<typeof fetch>('application.fetch'),
  can: token<Can>('application.can'),
  features: token('application.can.features'),

  notFoundView: token<() => Promise<Component>>('application.not-found'),
  applicationComponents: token('application.components'),
  DataEmptyState: token('application.components.data-empty-state'),

  sources: token('data.sources'),
  dataSourcePool: token<DataSourcePool>('data.DataSourcePool'),
  getDataSourceCacheKeyPrefix: token<() => string>('data.getDataSourceCacheKeyPrefix'),
  errorHandler: token<(e: Error) => void>('application.error.handler'),

  i18n: token<{t: ReturnType<typeof I18n>['t']}>('i18n'),
  enUs: token('i18n.locale.enUs'),

  storage: token<ReturnType<typeof storage>>('application.storage'),
  storagePrefix: token<string>('application.storage.prefix'),
}

const addModule = (item: RouteRecordRaw, parent?: RouteRecordRaw) => {
  item.meta = {
    ...(item.meta ?? {}),
  }
  if (typeof parent?.meta?.module !== 'undefined') {
    item.meta.module = parent.meta.module
  }
}
const addPath = (item: RouteRecordRaw, parent?: RouteRecordRaw) => {
  item.meta = {
    ...(item.meta ?? {}),
  }
  if (typeof parent?.meta?.path !== 'undefined') {
    const path = String(parent.meta.path ?? '')
    item.meta.path = `${path}${path.length > 0 ? '.' : ''}${String(item.name)}`
  }
}
const addRouteName = (item: RouteRecordRaw) => {
  if (typeof item.name === 'undefined') {
    return
  }
  const props = ((props) => {
    switch (true) {
      case typeof props === 'function':
        return props
      case typeof props === 'undefined':
        return () => ({})
      default:
        return () => props
    }
  })(item.props)
  item.props = (...args) => {
    return {
      ...props(...args),
      routeName: item.name,
    }
  }
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('application.plugins'), {
      service: (dataSourcePool, can, env, i18n) => {
        return [
          [Data, { dataSourcePool }],
          [Routing, { can, env, i18n }],
        ]
      },
      arguments: [
        $.dataSourcePool,
        $.can,
        $.env,
        $.i18n,
      ],
      labels: [
        app.plugins,
      ],
    }],
    [token('application.components'), {
      service: () => {
        return [
          ['AppView', AppView],
          ['DataLoader', DataLoader],
          ['DataSource', DataSource],
          ['DataSink', DataSink],
          ['DataCollection', DataCollection],
          ['RouteView', RouteView],
          ['RouteTitle', RouteTitle],
        ]
      },
      labels: [
        app.components,
      ],
    }],
    [$.DataEmptyState, {
      service: () => XEmptyState,
    }],

    [token('application.routes'), {
      service: routes,
      arguments: [
        $.notFoundView,
      ],
      labels: [
        app.routes,
      ],
    }],
    [token('application.routes.walkers'), {
      service: () => {
        return [
          addModule,
          addPath,
          addRouteName,
        ]
      },
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('application.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],

    //

    [$.i18n, {
      service: I18n,
      arguments: [
        $.enUs,
        app.env,
      ],
    }],

    [$.fetch, {
      service: () => fetch,
    }],

    [$.storage, {
      service: storage,
      arguments: [
        app.storagePrefix,
      ],
    }],

    [$.can, {
      service: can,
      arguments: [
        $.features,
      ],
    }],

    [$.features, {
      service: () => [],
    }],

    [$.env, {
      service: env,
      arguments: [
        $.vars,
      ],
    }],

    [$.getDataSourceCacheKeyPrefix, {
      service: () => () => '',
      arguments: [
        app.router,
      ],
    }],

    [$.errorHandler, {
      service: () => () => { },
    }],

    [$.dataSourcePool, {
      service: (sources: Sources, errorHandler: () => void, getKey: () => string) => {
        return new DataSourcePool(sources, { create, destroy }, errorHandler, getKey)
      },
      arguments: [
        app.sources,
        $.errorHandler,
        $.getDataSourceCacheKeyPrefix,
      ],
    }],
    [token('application.datasource.data-uri'), {
      service: () => {
        return {
          'data:application/json,:uri': async ({ uri }: { uri: string }) => {
            return JSON.parse(uri)
          },
        }
      },
      labels: [
        app.sources,
      ],
    }],
    ...kuma(app),
  ]
}
export const TOKENS = $
export const [
  useEnv,
  useCan,
  useI18n,
  useDataEmptyState,
] = createInjections(
  $.env,
  $.can,
  $.i18n,
  $.DataEmptyState,
)
export { YAML, get } from './utilities'
