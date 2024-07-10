import { i18nTComponent } from '@kong-ui-public/i18n'
// @ts-ignore TS comes with a Object.groupBy declaration but not a polyfill
import groupBy from 'object.groupby'

import AppView from './components/app-view/AppView.vue'
import DataCollection from './components/data-collection/DataCollection.vue'
import DataLoader from './components/data-source/DataLoader.vue'
import DataSink from './components/data-source/DataSink.vue'
import DataSource from './components/data-source/DataSource.vue'
import RouteTitle from './components/route-view/RouteTitle.vue'
import RouteView from './components/route-view/RouteView.vue'
import { routes } from './routes'
import can from './services/can'
import type { Can } from './services/can'
import type { EnvVars } from './services/env/Env'
import Env from './services/env/Env'
import I18n from './services/i18n/I18n'
import type { Source } from '@/app/application/services/data-source'
import { create, destroy, getSource, DataSourcePool } from '@/app/application/services/data-source'
import { services as kuma } from '@/app/kuma'
import { TOKENS as ME, services as me } from '@/app/me'
import { services as x } from '@/app/x'
import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections, constant } from '@/services/utils'
import type { Component } from 'vue'
export * from './services/can'

// temporary simple "JSON data only" structuredClone polyfill for cloning JSON
// data
// TODO(jc): delete this once we get to 2025
if (!('structuredClone' in globalThis)) {
  globalThis.structuredClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  }
}
// temporary Object.groupBy polyfill
// TODO(jc): delete this once we get to 2026
groupBy.shim()

export type { DataSourceResponse, Source, TypeOf } from './services/data-source'
type Sources = ConstructorParameters<typeof DataSourcePool>[0]

type Token = ReturnType<typeof token>

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppView: typeof AppView
    DataSource: typeof DataSource
    DataSink: typeof DataSink
    DataLoader: typeof DataLoader
    DataCollection: typeof DataCollection
    RouteView: typeof RouteView
    RouteTitle: typeof RouteTitle
    I18nT: ReturnType<typeof i18nTComponent>
  }
}

const $ = {
  ...ME,
  Env: token<Env>('application.Env'),
  env: token<Env['var']>('application.env'),
  EnvVars: token<EnvVars>('EnvVars'),

  can: token<Can>('application.can'),
  features: token('application.can.features'),

  notFoundView: token<() => Promise<Component>>('application.not-found'),
  applicationComponents: token('application.components'),

  source: token<Source>('data.source'),
  sources: token('data.sources'),
  dataSourcePool: token<DataSourcePool>('data.DataSourcePool'),
  getDataSourceCacheKeyPrefix: token<() => string>('data.getDataSourceCacheKeyPrefix'),
  errorHandler: token<(e: Error) => void>('application.error.handler'),

  i18n: token<ReturnType<typeof I18n>>('i18n'),
  enUs: token('i18n.locale.enUs'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [

    ...me(app),
    ...x(app),
    ...kuma(app),

    [token('application.components'), {
      service: (i18n: ReturnType<typeof I18n>) => {
        return [
          ['AppView', AppView],
          ['DataLoader', DataLoader],
          ['DataSource', DataSource],
          ['DataSink', DataSink],
          ['DataCollection', DataCollection],
          ['RouteView', RouteView],
          ['RouteTitle', RouteTitle],
          ['I18nT', i18nTComponent(i18n)],
        ]
      },
      arguments: [
        app.i18n,
      ],
      labels: [
        app.components,
      ],
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

    //

    [$.i18n, {
      service: I18n,
      arguments: [
        $.enUs,
        app.env,
      ],
    }],

    [$.can, {
      service: can,
      arguments: [
        $.features,
      ],
    }],
    [$.Env, {
      service: Env,
      arguments: [
        app.EnvVars,
      ],
    }],

    [$.env, {
      service: (env: Env): Env['var'] => {
        return (...rest) => env.var(...rest)
      },
      arguments: [
        $.Env,
      ],
    }],

    [$.source, {
      service: getSource,
      arguments: [constant(document, { description: 'dom.document' })],
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
      service: (sources: Sources, getKey: () => string) => {
        return new DataSourcePool(sources, { create, destroy }, getKey)
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

  ]
}
export const TOKENS = $
export const [
  useEnv,
  useCan,
  useI18n,
  useDataSourcePool,
] = createInjections(
  $.env,
  $.can,
  $.i18n,
  $.dataSourcePool,
)
export { uniqueId } from './utilities'
