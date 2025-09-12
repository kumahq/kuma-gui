import type { Env } from '@/app/application'
import type { Features } from '@kumahq/settings/can'
export const features = (env: Env) => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
    'create zones': () => {
      return false
    },
  }
}
declare module '@/app/application' {
  interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
