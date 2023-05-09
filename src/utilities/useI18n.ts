import { get } from './get'

export type I18nMessages = Record<string, any>

export type I18n = ReturnType<typeof useI18n>

export function getI18nMessages(): I18nMessages {
  return {
    // A map of (machine-readable) terms (e.g. fields that come from API data) to (human-readable) labels to used in the UI.
    termLabels: {
      mtls: 'mTLS',
    },
  }
}

function translate(messages: I18nMessages, pathOrProps: string | string[], placeholders: Record<string, string> = {}): string {
  let value = get(messages, pathOrProps)

  if (value === undefined) {
    const path = Array.isArray(pathOrProps) ? pathOrProps.join('.') : pathOrProps
    throw new Error(`[useI18n]: Could not find translation for path “${path}”.`)
  }

  for (const placeholder in placeholders) {
    value = value.replaceAll(`{${placeholder}}`, placeholders[placeholder])
  }

  return value
}

export function useI18n(messages: I18nMessages) {
  function t(pathOrProps: string | string[], placeholders: Record<string, string> = {}) {
    return translate(messages, pathOrProps, placeholders)
  }

  return {
    t,
  }
}
