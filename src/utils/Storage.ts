type StorageKeyValues = 'dpVisibleTableHeaderKeys'

/**
 * Utility object for accessing `window.localStorage`.
 *
 * Automatically serializes/deserializes values to/from JSON strings.
 *
 * Wraps local storage calls in try-catch blocks because those methods can through when the local storage of the user runs out of physical space or strict cookie protection schemes are engaged.
 */
export const Storage = {
  get(storageKey: StorageKeyValues): any {
    try {
      const item = window.localStorage.getItem(storageKey)

      return item !== null ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set(storageKey: StorageKeyValues, value: any): void {
    try {
      const stringifiedValue = JSON.stringify(value)

      window.localStorage.setItem(storageKey, stringifiedValue)
    } catch {}
  },

  remove(storageKey: StorageKeyValues): void {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {}
  },
}
