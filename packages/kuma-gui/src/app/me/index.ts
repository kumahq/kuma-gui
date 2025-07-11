import { token } from '@kumahq/container'

import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>

const $ = {
  sources: token<Sources>('me.sources'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.storage,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
export const TOKENS = $
