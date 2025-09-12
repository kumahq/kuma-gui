import { token, get } from '@kumahq/container'
import { Cookie } from '@kumahq/fake-api'

import debugI18n from './services/i18n/DebugI18n'
import type { Env } from '@/app/application'
import type { ServiceDefinition, Token } from '@kumahq/container'

type I18n = ReturnType<typeof debugI18n>

export const services = (app: Record<string, Token>, prefix = 'KUMA'): ServiceDefinition[] => [
  [token('i18n.debug'), {
    service: (i18n: () => I18n) => {
      const env = get(app.env) as Env
      // @ts-ignore PREFIX_I18N_DEBUG_ENABLED is debug only
      if (env(`${prefix}_I18N_DEBUG_ENABLED`).length > 0) {
        return debugI18n(i18n())
      }
      return i18n()
    },
    decorates: app.i18n,
  }],
  [token('env.debug'), {
    service: (getEnv: () => Env) => {

      const env = getEnv()
      return (...[ key, ...rest ]: Parameters<Env>) => {
        // make sure you can't read/replace anything but PREFIX_*
        return Cookie.parse(document.cookie ?? '', { prefix: `${prefix}_`})[key] ?? env(key, ...rest)
      }
    },
    decorates: app.env,
  }],
]
