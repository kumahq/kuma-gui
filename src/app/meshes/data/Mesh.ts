import type {
  Backend,
  MeshBackend,
  Mesh as PartialMesh,
} from '@/types/index.d'

export const Mesh = {
  fromObject(item: PartialMesh) {
    const mtlsBackend = getBackend(item.mtls)
    const metricsBackend = getBackend(item.metrics)

    return {
      ...item,
      config: item,
      meshServices: ((item = {}) => {
        return {
          ...item,
          mode: item.mode ?? 'Disabled',
        }
      })(item.meshServices),
      mtlsBackend,
      metricsBackend,
      routing: ((item = {}) => {
        return {
          ...item,
          zoneEgress: typeof item.zoneEgress !== 'undefined' ? item.zoneEgress : false,
        }
      })(item.routing),
    }
  },
}
function getBackend(meshBackend?: MeshBackend): Backend | undefined {
  if (meshBackend?.enabledBackend && Array.isArray(meshBackend.backends)) {
    return meshBackend.backends.find((backend) => backend.name === meshBackend.enabledBackend)
  }

  return undefined
}

export type Mesh = ReturnType<typeof Mesh['fromObject']>
