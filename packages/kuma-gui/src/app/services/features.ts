import { runInDebug } from '@/app/application'
import { Mesh } from '@/app/meshes/data'
import type { Features } from '@kumahq/settings/can'
export const features = (): Features => {
  return {
    'use service-insights': (_can, mesh: Mesh) => {
      runInDebug(() => {
        if (typeof mesh === 'undefined') {
          // throw new Error('argument `mesh` not provided for can(`use service-insights`)')
          return false
        }
      })
      return mesh.meshServices.mode !== 'Exclusive'
    },
  }
}
