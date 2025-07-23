import type { Can, Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (env: Env['var']): Features => {
  return {
    'use kubernetes': (_can: Can) => {
      return env('KUMA_ENVIRONMENT') === 'kubernetes'
    },
    'use state': (_can: Can) => {
      return env('KUMA_STORE_TYPE') !== 'memory'
    },
  }
}
