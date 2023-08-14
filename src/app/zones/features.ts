import type { Can } from '@/app/application/services/can'
import type Env from '@/services/env/Env'
export const features = (env: Env['var']) => {
  const features = {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
    'create zones': (can: Can) => {
      return can('use zones') && env('KUMA_ZONE_CREATION_FLOW') === 'enabled'
    },
  }
  return features
}
