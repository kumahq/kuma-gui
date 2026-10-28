export const IS_MAYBE_MAC = typeof navigator !== 'undefined' &&
  ('userAgentData' in navigator && navigator.userAgentData === 'macOS' ||
    navigator.platform?.toLowerCase().includes('mac'))
