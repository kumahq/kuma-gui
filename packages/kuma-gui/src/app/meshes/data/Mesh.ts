import type { components } from '@kumahq/kuma-http-api'

// @TODO(types) provide support for v2 and v3
type Backend = {
  name: string
  type: string
}
type MeshBackend = {
  enabledBackend?: string
  defaultBackend?: string
  backends?: Backend[]
}
//

type PartialMesh = components['schemas']['MeshItem']
export const Mesh = {
  fromObject(item: PartialMesh) {
    return {
      ...item,
      id: item.name,
      config: item,
      labels: item.labels ?? {},
      meshServices: ((item = {}) => {
        return {
          ...item,
          mode: item.mode ?? 'Disabled',
        }
      })(item.meshServices),
      // @TODO(types) provide support for v2 and v3
      mtlsBackend: ((mtls: MeshBackend | undefined) => {
        if(typeof mtls === 'undefined') {
          return
        }
        return mtls.enabledBackend && Array.isArray(mtls.backends) ? mtls.backends.find(backend => backend.name === mtls.enabledBackend) : undefined
      })('mtls' in item ? item.mtls as MeshBackend : undefined),
      //
    }
  },
}
export type Mesh = ReturnType<typeof Mesh.fromObject>
