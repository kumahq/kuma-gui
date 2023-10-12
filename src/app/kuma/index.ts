import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('kuma.components.not-found'),
      {
        service: () => [
          () => import('@/app/kuma/views/NotFoundView.vue'),
        ],
        labels: [
          app.notFoundView,
        ],
      },
    ],

  ]
}
