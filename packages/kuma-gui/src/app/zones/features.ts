import type { Can } from '@/app/application'
import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (env: Env['var']) => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
    'create zones': (can: Can) => {
      return false
    },
  }
}
declare module '@/app/application' {
  interface Abilities {
    can(...args: Features<ReturnType<typeof features>>): boolean
  }
}
