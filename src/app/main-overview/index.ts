import { features } from './features'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>
type Features = ReturnType<typeof features>

const $ = {
  sources: token<Sources>('control-planes.sources'),
  features: token<Features>('control-planes.features'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [$.features, {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],

  ]
}
export const TOKENS = $
