import { routes } from './routes'
import type { SplitRouteRecordRaw } from './routes'
import { sources } from './sources'
import { routes as dataplaneRoutes, services as dataplanes } from '@/app/data-planes'
import { routes as gatewayRoutes, services as gateways } from '@/app/gateways'
import { routes as policyRoutes, services as policies } from '@/app/policies'
import { routes as serviceRoutes, services as servicesModule } from '@/app/services'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  dataplaneRoutes: token<SplitRouteRecordRaw[]>('kuma.dataplane.routes'),
  gatewayRoutes: token<SplitRouteRecordRaw[]>('kuma.gateway.routes'),
  serviceRoutes: token<SplitRouteRecordRaw[]>('kuma.service.routes'),
  policyRoutes: token<SplitRouteRecordRaw[]>('kuma.policy.routes'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('meshes.routes'), {
      service: routes,
      arguments: [
        $.serviceRoutes,
        $.gatewayRoutes,
        $.dataplaneRoutes,
        $.policyRoutes,
      ],
      labels: [
        app.routes,
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

    [token('meshes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    ...servicesModule(app),
    ...dataplanes(app),
    ...gateways(app),
    ...policies(app),
  ]
}
