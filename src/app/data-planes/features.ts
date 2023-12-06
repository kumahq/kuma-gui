import type { Features } from '@/app/application/services/can'
import type Env from '@/services/env/Env'
export const features = (env: Env['var']): Features => {
  return {
    'read traffic': () => {
      try {
        return !!JSON.parse(env('KUMA_TRAFFIC_ENABLED', 'false'))
      } catch (e) {
        return false
      }
    },
  }
}
