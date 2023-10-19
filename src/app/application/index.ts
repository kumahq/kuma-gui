import { i18nTComponent } from '@kong-ui-public/i18n'

import AppView from './components/app-view/AppView.vue'
import DataSource from './components/data-source/DataSource.vue'
import RouteTitle from './components/route-view/RouteTitle.vue'
import RouteView from './components/route-view/RouteView.vue'
import { routes } from './routes'
import can from './services/can'
import I18n from './services/i18n/I18n'
import DataSourceLifeCycle, { getSource } from '@/app/application/services/data-source'
import type { Source } from '@/app/application/services/data-source'
import { DataSourcePool } from '@/app/application/services/data-source/DataSourcePool'
import type { EnvVars } from '@/services/env/Env'
import Env from '@/services/env/Env'
import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections, constant } from '@/services/utils'
import type { Component } from 'vue'

export type { DataSourceResponse, Source } from './services/data-source'

type Can = ReturnType<typeof can>
type Token = ReturnType<typeof token>

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppView: typeof AppView
    DataSource: typeof DataSource
    RouteView: typeof RouteView
    RouteTitle: typeof RouteTitle
    I18nT: ReturnType<typeof i18nTComponent>
  }
}

const $ = {
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
  dataSourceLifecycle: token<typeof DataSourceLifeCycle>('data.DataSourceLifecycle'),
  getDataSourceCacheKeyPrefix: token<() => string>('data.getDataSourceCacheKeyPrefix'),

  i18n: token<ReturnType<typeof I18n>>('i18n'),
  enUs: token('i18n.locale.enUs'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [

    [token('application.components'), {
      service: (i18n: ReturnType<typeof I18n>) => {
        return [
          ['AppView', AppView],
          ['DataSource', DataSource],
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

    [$.dataSourceLifecycle, {
      constant: DataSourceLifeCycle,
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

    [$.dataSourcePool, {
      service: DataSourcePool,
      arguments: [
        app.sources,
        $.dataSourceLifecycle,
        $.getDataSourceCacheKeyPrefix,
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
