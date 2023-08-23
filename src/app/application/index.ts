import AppView from './components/app-view/AppView.vue'
import DataSource from './components/data-source/DataSource.vue'
import RouteTitle from './components/route-view/RouteTitle.vue'
import RouteView from './components/route-view/RouteView.vue'
import can from './services/can'
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
  }
}

const $ = {
  can: token<Can>('application.can'),
  features: token('application.can.features'),
  applicationComponents: token('application.components'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.applicationComponents, {
      service: () => {
        return [
          ['AppView', AppView],
          ['DataSource', DataSource],
          ['RouteView', RouteView],
          ['RouteTitle', RouteTitle],
        ]
      },
      labels: [
        app.components,
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
  useCan,
] = createInjections(
  $.can,
)
