import type { Features } from '@/app/application'
import type Env from '@/app/application/services/env/Env'
import { Mesh } from '@/app/meshes/data'
export const features = (env: Env['var']): Features => {
  return {
    'use meshservice': () => {
      try {
        return !!JSON.parse(env('KUMA_MESHSERVICE_ENABLED', 'true'))
      } catch (e) {
        return true
      }
    },
    'use service-insights': (_can, mesh: Mesh) => {
      return mesh.meshServices?.enabled !== 'Exclusive'
    },
  }
}
