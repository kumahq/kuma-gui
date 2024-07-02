import type { Features } from '@/app/application/services/can'
import type Env from '@/app/application/services/env/Env'
export const features = (env: Env['var']): Features => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
  }
}
