import { createI18n } from '@kong-ui-public/i18n'

import type Env from '@/services/env/Env'
import { camelCaseToWords } from '@/utilities/camelCaseToWords'
import { get } from '@/utilities/get'

declare module 'intl-messageformat' {
  interface Options {
    fallback: string
  }
}

interface I18nRecord {
  [key: string]: I18nRecord | string
}

class I18nError extends Error {
  get key() {
    return this.message
  }
}

export default <T extends I18nRecord>(strs: T, env: Env['var']) => {
  const i18n = createI18n<typeof strs>('en-us', strs, true)
  return {
    ...i18n,
    t: function (...rest: Parameters<typeof i18n['t']>) {
      const key = rest[0]
      try {
        if (typeof get(strs, key) === 'undefined') {
          if (key.startsWith('http.api.')) {
            throw new I18nError(key)
          } else {
            throw new Error(`Missing message: "${key}" for locale "en-us", using id as fallback`)
          }
        }
        rest[1] = { KUMA_DOCS_URL: env('KUMA_DOCS_URL'), KUMA_UTM_QUERY_PARAMS: env('KUMA_UTM_QUERY_PARAMS'), ...rest[1] }
        return i18n.t(...rest)
      } catch (e) {
        switch (true) {
          case e instanceof I18nError:
            // temporarily change any http.api terms to camelCase at runtime
            return camelCaseToWords((e as I18nError).key.split('.').pop()!)
          default:
            if (rest[2]?.fallback) {
              return rest[2].fallback
            }

            throw e
        }
      }
    },
  }
}
