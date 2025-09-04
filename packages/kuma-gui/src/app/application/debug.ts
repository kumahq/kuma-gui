import { token, get } from '@kumahq/container'

import debugI18n from './services/i18n/DebugI18n'
import type { Env } from '@/app/application'
import type { ServiceDefinition, Token } from '@kumahq/container'

type I18n = ReturnType<typeof debugI18n>

const prefixedWith = (prefix = '') => (str: string) => {
  return Object.fromEntries(str.split(';')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => {
      const [key, ...value] = item.split('=')
      return [key, value.join('=')] as [string, string]
    })
    .filter(([key, _value]) => key.startsWith(prefix)))
}
export const services = (app: Record<string, Token>, prefix = 'KUMA'): ServiceDefinition[] => [
  [token('i18n.debug'), {
    service: (i18n: () => I18n) => {
      const env = get(app.env) as Env
      // @ts-expect-error PREFIX_I18N_DEBUG_ENABLED is debug only
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
        return prefixedWith(`${prefix}_`)(document.cookie)[key] ?? env(key, ...rest)
      }
    },
    decorates: app.env,
  }],
]
