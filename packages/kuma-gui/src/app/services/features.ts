import { Mesh } from '@/app/meshes/data'
import type { Features } from '@kumahq/settings/can'
export const features = () => {
  return {
    'use service-insights': (_can: unknown, mesh: Mesh) => {
      return mesh.meshServices.mode !== 'Exclusive'
    },
  }
}
declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
