import { token } from '@kumahq/container'
import { Cookie } from '@kumahq/fake-api'

import debugI18n from './services/i18n/DebugI18n'
import type { Env } from '@/app/application'
import type { ServiceDefinition, Token } from '@kumahq/container'

type I18n = ReturnType<typeof debugI18n>
export const services = (app: Record<string, Token>, prefix = 'KUMA'): ServiceDefinition[] => [
  [token('i18n.debug'), {
    service: (useI18n: () => I18n) => {
      const i18n = useI18n()
      return {
        ...i18n,
        t: (...args: Parameters<typeof i18n['t']>) => {
          const cookies = Cookie.parse(document.cookie ?? '', { prefix: `${prefix}_` })
          const env = (key: string) => {
            return cookies[key] ?? ''
          }
          if (env(`${prefix}_I18N_DEBUG_ENABLED`).length > 0) {
            return args[0]
          }
          return i18n.t(...args)
        } ,
      }
    },
    decorates: app.i18n,
  }],
  [token('env.debug'), {
    service: (useEnv: () => Env) => {
      const env = useEnv()
      return (...[key, ...rest]: Parameters<Env>) => {
        // make sure you can't read/replace anything but PREFIX_*
        return Cookie.parse(document.cookie ?? '', { prefix: `${prefix}_` })[key] ?? env(key, ...rest)
      }
    },
    decorates: app.env,
  }],
]
