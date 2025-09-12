import type { Env } from '@/app/application'
import type { Features } from '@kumahq/settings/can'
export const features = (env: Env) => {
  return {
    'use kubernetes': () => {
      return env('KUMA_ENVIRONMENT') === 'kubernetes'
    },
    'use state': () => {
      return env('KUMA_STORE_TYPE') !== 'memory'
    },
  }
}
declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
