import { i18nTComponent } from '@kong-ui-public/i18n'

import AppView from './components/app-view/AppView.vue'
import DataSource from './components/data-source/DataSource.vue'
import RouteTitle from './components/route-view/RouteTitle.vue'
import RouteView from './components/route-view/RouteView.vue'
import can from './services/can'
import I18n from './services/i18n/I18n'
import { token, createInjections } from '@/services/utils'
import type { ServiceDefinition } from '@/services/utils'

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
  can: token<Can>('application.can'),
  features: token('application.can.features'),
  i18n: token<ReturnType<typeof I18n>>('i18n'),
  enUs: token('i18n.locale.enUs'),
  applicationComponents: token('application.components'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.applicationComponents, {
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
  ]
}
export const TOKENS = $
export const [
  useI18n,
  useCan,
] = createInjections(
  $.i18n,
  $.can,
)
