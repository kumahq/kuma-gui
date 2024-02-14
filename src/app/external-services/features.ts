import type { Features } from '@/app/application/services/can'
import type Env from '@/services/env/Env'

export const features = (env: Env['var']): Features => {
  return {
    'use gateways ui': () => {
      try {
        return !!JSON.parse(env('KUMA_GATEWAYS_UI', 'false'))
      } catch (e) {
        return false
      }
    },
  }
}
