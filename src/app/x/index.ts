import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XDisclosure: typeof XDisclosure
  }
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('x.vue.components'),
      {
        service: () => {
          return [
            ['XTeleportTemplate', XTeleportTemplate],
            ['XTeleportSlot', XTeleportSlot],
            ['XDisclosure', XDisclosure],
          ]
        },
        labels: [
          app.components,
        ],
      },
    ],
  ]
}
