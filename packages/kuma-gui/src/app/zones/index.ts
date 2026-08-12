import { token, createInjections } from '@kumahq/container'

import ZoneActionGroup from './components/ZoneActionGroup.vue'
import ZoneControlPlanesList from './components/ZoneControlPlanesList.vue'
import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application'
import { services as subscriptions } from '@/app/subscriptions'
import type { ServiceDefinition } from '@kumahq/container'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

const $ = {
  ZoneControlPlanesList: token<typeof ZoneControlPlanesList>('zones.components.ZoneControlPlanesList'),
  ZoneActionGroup: token<typeof ZoneActionGroup>('zones.components.ZoneActionGroup'),
  ZoneAppNavigator: token<Component | undefined>('zones.components.ZoneAppNavigator'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.ZoneControlPlanesList, {
      service: () => ZoneControlPlanesList,
    }],
    [$.ZoneActionGroup, {
      service: () => ZoneActionGroup,
    }],
    [$.ZoneAppNavigator, {
      service: () => undefined,
    }],
    [token('zones.routes'), {
      service: (can: Can) => {
        return [
          (item: RouteRecordRaw) => {
            if (can('use zones') && item.name === 'control-plane-root-view') {
              item.children = (item.children ?? []).concat(routes())
            }
          },
        ]
      },
      arguments: [
        app.can,
      ],
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('zone.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('zone.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('zones.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...subscriptions(app),
  ]
}
export const TOKENS = $
export const [
  useZoneControlPlanesList,
  useZoneActionGroup,
  useZoneHomeNavigatorFallback,
] = createInjections(
  $.ZoneControlPlanesList,
  $.ZoneActionGroup,
  $.ZoneAppNavigator,
)
