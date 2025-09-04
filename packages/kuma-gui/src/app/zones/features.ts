import type { Env } from '@/app/application'
import type { Features } from '@kumahq/settings/can'
export const features = (env: Env): Features => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
    'create zones': () => {
      return false
    },
  }
}

