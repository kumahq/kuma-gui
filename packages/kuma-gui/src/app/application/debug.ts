import cookied from './services/env/CookiedEnv'
import type Env from './services/env/Env'
import debugI18n from './services/i18n/DebugI18n'
import type { ServiceDefinition, Token } from '@/services/utils'
import { token, get } from '@/services/utils'

type I18n = ReturnType<typeof debugI18n>

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('i18n.debug'), {
    service: (i18n: () => I18n) => {
      const env = get(app.env)
      // @ts-ignore We don't want TS to show this elsewhere in the application
      // and this is the most straight-forwards way to achieve that right now
      if (env('KUMA_I18N_DEBUG_ENABLED', '').length > 0) {
        return debugI18n(i18n())
      }
      return i18n()
    },
    decorates: app.i18n,
  }],
  [token('env.debug'), {
    service: (env: () => Env['var']) => {
      return cookied(env())
    },
    decorates: app.env,
  }],
]
