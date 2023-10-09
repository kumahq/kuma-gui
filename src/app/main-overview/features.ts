import type { Can, Features } from '@/app/application/services/can'
import type Env from '@/services/env/Env'
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
