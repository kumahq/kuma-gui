import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (env: Env['var']) => {
  return {
    'use kubernetes': () => {
      return env('KUMA_ENVIRONMENT') === 'kubernetes'
    },
    'use state': () => {
      return env('KUMA_STORE_TYPE') !== 'memory'
    },
  }
}
declare module '@kumahq/settings/can' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
