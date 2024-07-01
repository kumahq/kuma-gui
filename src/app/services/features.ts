import type { Features } from '@/app/application'
import type Env from '@/app/application/services/env/Env'
export const features = (env: Env['var']): Features => {
  return {
    'use meshservice': () => {
      try {
        return !!JSON.parse(env('KUMA_MESHSERVICE_ENABLED', 'true'))
      } catch (e) {
        return true
      }
    },
  }
}
