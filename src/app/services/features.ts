import type { Features } from '@/app/application/services/can'
export const features = (): Features => {
  return {
    'use meshservice': () => {
      return false
    },
  }
}
