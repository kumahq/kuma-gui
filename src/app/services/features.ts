import type { Features } from '@/app/application'
import { runInDebug } from '@/app/application'
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
      runInDebug(() => {
        if (typeof mesh === 'undefined') {
          throw new Error('argument `mesh` not provided for can(`use service-insights`)')
        }
      })
      return mesh.meshServices.mode !== 'Exclusive'
    },
  }
}
