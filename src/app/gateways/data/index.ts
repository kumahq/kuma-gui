import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  MeshGatewaySelector,
  MeshGateway as PartialMeshGateway,
} from '@/types/index.d'

export type MeshGateway = PartialMeshGateway & {
  config: PartialMeshGateway
  selectors: MeshGatewaySelector[]
}

export const MeshGateway = {
  fromObject(partialMeshGateway: PartialMeshGateway): MeshGateway {
    const { selectors = [] } = partialMeshGateway

    return {
      ...partialMeshGateway,
      config: partialMeshGateway,
      selectors,
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
