import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  MeshGatewayListener as PartialMeshGatewayListener,
  MeshGatewaySelector,
  MeshGateway as PartialMeshGateway,
} from '@/types/index.d'

type MeshGatewayListener = Omit<PartialMeshGatewayListener, 'hostname' | 'protocol'> & {
  hostname: string
  protocol: Exclude<PartialMeshGatewayListener['protocol'], undefined>
}

export type MeshGateway = Omit<PartialMeshGateway, 'selectors' | 'conf'> & {
  config: PartialMeshGateway
  selectors: MeshGatewaySelector[]
  conf: {
    listeners: MeshGatewayListener[]
  }
}

export const MeshGateway = {
  fromObject(partialMeshGateway: PartialMeshGateway): MeshGateway {
    const { selectors = [], conf = {} } = partialMeshGateway

    const listeners: MeshGatewayListener[] = (conf.listeners ?? []).map((listener) => ({
      ...listener,
      // An omitted hostname implies the wildcard hostname (meaning any hostname applies).
      hostname: listener.hostname ?? '*',
      protocol: listener.protocol ?? 'TCP',
    }))

    return {
      ...partialMeshGateway,
      config: partialMeshGateway,
      selectors,
      conf: {
        listeners,
      },
    }
  },

  fromCollection(partialMeshGateways: PaginatedApiListResponse<PartialMeshGateway>): PaginatedApiListResponse<MeshGateway> {
    return {
      ...partialMeshGateways,
      items: Array.isArray(partialMeshGateways.items)
        ? partialMeshGateways.items.map((partialMeshGateway) => MeshGateway.fromObject(partialMeshGateway))
        : [],
    }
  },
}
