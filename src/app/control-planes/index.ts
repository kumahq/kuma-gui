import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  sources: token<ReturnType<typeof sources>>('control-planes.sources'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.env,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}

export const TOKENS = $
