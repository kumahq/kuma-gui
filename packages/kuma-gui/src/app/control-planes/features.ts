import type { Env } from '@/app/application'
import type { Can, Features } from '@kumahq/settings/can'
export const features = (env: Env): Features => {
  return {
    'use kubernetes': (_can: Can) => {
      return env('KUMA_ENVIRONMENT') === 'kubernetes'
    },
    'use state': (_can: Can) => {
      return env('KUMA_STORE_TYPE') !== 'memory'
    },
  }
}
