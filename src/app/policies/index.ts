import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'
export * from './routes'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>

const $ = {
  sources: token<Sources>('policy.sources'),
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
  ]
}
export const TOKENS = $
