import { createI18n } from '@kong-ui-public/i18n'

import { camelCaseToWords } from '@/utilities/camelCaseToWords'
import { get } from '@/utilities/get'

interface I18nRecord {
  [key: string]: I18nRecord | string
}

class I18nError extends Error {
  get key() {
    return this.message
  }
}

export default <T extends I18nRecord>(strs: T) => {
  const i18n = createI18n<typeof strs>('en-us', strs, true)
  return {
    ...i18n,
    t: function (...rest: Parameters<typeof i18n['t']>) {
      const key = rest[0]
      try {
        if (typeof get(strs, key) === 'undefined') {
          if (key.startsWith('http.api.')) {
            throw new I18nError(key)
          }
        }
        return i18n.t(...rest)
      } catch (e: unknown) {
        switch (true) {
          case e instanceof I18nError:
            // temporarily change any http.api terms to camelCase at runtime
            return camelCaseToWords((e as I18nError).key.split('.').pop()!)
          default:
            throw e
        }
      }
    },
  }
}
