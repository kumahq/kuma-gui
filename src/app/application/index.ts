import can from './services/can'
import { token, createInjections } from '@/services/utils'
import type { ServiceDefinition } from '@/services/utils'
type Can = ReturnType<typeof can>
type Token = ReturnType<typeof token>

const $ = {
  can: token<Can>('application.can'),
  features: token('application.can.features'),
}
export const services = (_app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.can, {
      service: can,
      arguments: [
        $.features,
      ],
    }],
  ]
}
export const TOKENS = $
export const [
  useCan,
] = createInjections(
  $.can,
)
