import type { Features } from '@kumahq/settings/can'

export const features = () => {
  return {
    'use service-insights': (_can: unknown, _mesh: unknown) => {
      return false
    },
    'use mesh-services': (_can: unknown, _mesh: unknown) => {
      return true
    },
  }
}
declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
