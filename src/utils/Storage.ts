type StorageKeyValues =
  'dpVisibleTableHeaderKeys' |
  'onboardingStep' |
  'onboardingIsCompleted' |
  'storedFormData' |
  'selectedMesh' |
  'codeBlockQueries'

/**
 * Utility object for accessing `window.localStorage`.
 *
 * Automatically serializes/deserializes values to/from JSON strings.
 *
 * Wraps local storage calls in try-catch blocks because those methods can through when the local storage of the user runs out of physical space or strict cookie protection schemes are engaged.
 */
export const Storage = {
  /**
   * Retrieves an item. Tries to parse the item as JSON before returning it. The item is returned as-is (i.e. as a string) if that fails. Returns `null` if no item for `storageKey` was found.
   */
  get(storageKey: StorageKeyValues): any {
    let item: string | null

    // Guards local storage access because it can throw when it’s full or strict cookie protection rules are in place.
    try {
      item = window.localStorage.getItem(storageKey)
    } catch {
      return null
    }

    // In case of `null` or the item not looking like JSON, we can return it as-is.
    if (item === null || !(item.startsWith('[') || item.startsWith('{'))) {
      return item
    }

    // Tries to parse the retrieved as JSON and returns it as-is if that fails.
    try {
      return JSON.parse(item)
    } catch {
      return item
    }
  },

  /**
   * Stores an item. Objects (and arrays) are turned into strings using `JSON.stringify`.
   */
  set(storageKey: StorageKeyValues, value: string | object): void {
    try {
      const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)

      window.localStorage.setItem(storageKey, stringifiedValue)
    } catch {}
  },

  remove(storageKey: StorageKeyValues): void {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {}
  },
}
