import type { Features } from '@kumahq/settings/can'
import type { Env } from '@kumahq/settings/env'
export const features = (env: Env['var']): Features => {
  return {
    'use zones': () => {
      return env('KUMA_MODE') === 'global'
    },
    'create zones': () => {
      return false
    },
  }
}
    
