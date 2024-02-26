import { routes } from './routes'
import type { SplitRouteRecordRaw } from './routes'
import { sources } from './sources'
import { routes as dataplaneRoutes, services as dataplanes } from '@/app/data-planes'
import { services as externalServicesModule } from '@/app/external-services'
import { routes as gatewayRoutes, services as gatewaysModule } from '@/app/gateways'
import { routes as policyRoutes, services as policies } from '@/app/policies'
import { routes as serviceRoutes, services as servicesModule } from '@/app/services'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  dataplaneRoutes: token<SplitRouteRecordRaw[]>('kuma.dataplane.routes'),
  serviceRoutes: token<SplitRouteRecordRaw[]>('kuma.service.routes'),
  gatewayRoutes: token<SplitRouteRecordRaw[]>('kuma.gateway.routes'),
  policyRoutes: token<SplitRouteRecordRaw[]>('kuma.policy.routes'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('meshes.routes'), {
      service: routes,
      arguments: [
        app.can,
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
    ...externalServicesModule(app),
    ...gatewaysModule(app),
    ...dataplanes(app),
    ...policies(app),
  ]
}
