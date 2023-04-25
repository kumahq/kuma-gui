export function useI18n(): Record<string, any> {
  return {
    // A map of (machine-readable) terms (e.g. fields that come from API data) to (human-readable) labels to used in the UI.
    termLabels: {
      mtls: 'mTLS',
    },
  }
}

export type I18n = ReturnType<typeof useI18n>
