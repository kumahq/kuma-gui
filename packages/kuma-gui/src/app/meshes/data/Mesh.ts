import type { components } from '@kumahq/kuma-http-api'

type PartialMesh = components['schemas']['MeshItem']
export const Mesh = {
  fromObject(item: PartialMesh) {
    return {
      ...item,
      id: item.name,
      config: item,
      meshServices: ((item = {}) => {
        return {
          ...item,
          mode: item.mode ?? 'Disabled',
        }
      })(item.meshServices),
      mtlsBackend: item.mtls?.enabledBackend && Array.isArray(item.mtls.backends) ?
        item.mtls.backends.find(backend => backend.name === item.mtls?.enabledBackend) : undefined,
      metricsBackend: item.metrics?.enabledBackend && Array.isArray(item.metrics.backends) ?
        item.metrics.backends.find(backend => backend.name === item.metrics?.enabledBackend) : undefined,
      routing: ((item = {}) => {
        return {
          ...item,
          zoneEgress: typeof item.zoneEgress !== 'undefined' ? item.zoneEgress : false,
        }
      })(item.routing),
    }
  },
}
export type Mesh = ReturnType<typeof Mesh.fromObject>
