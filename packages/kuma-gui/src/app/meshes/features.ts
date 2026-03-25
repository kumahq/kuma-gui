import type { Env } from '@/app/application'
import type { Features } from '@kumahq/settings/can'

export const features = (env: Env) => {
  return {
    'use resources route': (_can: unknown) => {
      return env('KUMA_RESOURCES_ROUTE_ENABLED') === 'true'
    },
  }
}

declare module '@/app/application' {
  export interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
