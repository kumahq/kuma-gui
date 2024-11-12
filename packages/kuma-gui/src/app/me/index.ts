import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>

const $ = {
  sources: token<Sources>('me.sources'),
  storagePrefix: token<string>('me.storage.prefix'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        $.storagePrefix,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
export const TOKENS = $
