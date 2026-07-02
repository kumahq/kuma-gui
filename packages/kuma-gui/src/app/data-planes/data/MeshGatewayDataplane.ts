import { Kri } from '@/app/kuma'
import type {
  MeshGatewayDataplane as PartialMeshGatewayDataplane,
  MeshGatewayListenerEntry,
  MeshGatewayRouteEntry,
  Meta,
} from '@/types/index.d'

export type MeshGatewayDataplane = PartialMeshGatewayDataplane & {
  listenerEntries: MeshGatewayListenerEntry[]
  routePolicies: Meta[]
}

export const MeshGatewayDataplane = {
  fromObject(partialMeshGatewayDataplane: PartialMeshGatewayDataplane): MeshGatewayDataplane {
    const listenerEntries = getListenerEntries(partialMeshGatewayDataplane)
    const routePolicies = Object.values(partialMeshGatewayDataplane.policies ?? {}).map(({ mesh, name, type }) => ({ mesh, name, type, kri: Kri.toString({ shortName: `~${type.toLowerCase()}`, mesh, name }) }))

    return {
      ...partialMeshGatewayDataplane,
      listenerEntries,
      routePolicies,
    }
  },
}

function getListenerEntries(meshGatewayDataplane: PartialMeshGatewayDataplane): MeshGatewayListenerEntry[] {
  const meshGatewayListenerEntries: MeshGatewayListenerEntry[] = []

  const listeners = meshGatewayDataplane.listeners ?? []
  for (const listener of listeners) {
    for (const host of listener.hosts) {
      for (const route of host.routes) {
        const routeEntries: MeshGatewayRouteEntry[] = []

        for (const destination of route.destinations) {
          const origins = Object.values(destination.policies ?? {}).map(({ mesh, name, type }) => ({ mesh, name, type, kri: Kri.toString({ shortName: `~${type.toLowerCase()}`, mesh, name }) }))

          const type = 'MeshGatewayRoute'
          const mesh = meshGatewayDataplane.gateway.mesh
          const name = route.route
          routeEntries.push({
            route: {
              mesh,
              name,
              type,
              kri: Kri.toString({ shortName: `~${type.toLocaleLowerCase()}`, mesh, name }),
            },
            service: destination.tags['kuma.io/service'],
            origins,
          })
        }

        meshGatewayListenerEntries.push({
          protocol: listener.protocol,
          port: listener.port,
          hostName: host.hostName,
          routeEntries,
        })
      }
    }
  }

  return meshGatewayListenerEntries
}

