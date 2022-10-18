type StorageKeyValues =
  'dpVisibleTableHeaderKeys' |
  'onboardingStep' |
  'onboardingIsCompleted' |
  'createMeshData' |
  'selectedMesh' |
  'codeBlockQueries'

/**
 * Utility object for accessing `window.localStorage` or `window.sessionStorage`.
 *
 * Automatically serializes/deserializes values to/from JSON strings.
 *
 * Wraps client storage calls in try-catch blocks because those methods can throw when the client storage of the user runs out of physical space or strict cookie protection schemes are engaged.
 *
 * **Usage**:
 *
 * ```javascript
 * const ClientSessionStorage = new BaseStorage(window.sessionStorage)
 *
 * ClientSessionStorage.set('key', { key: 'value' })
 * ClientSessionStorage.get('key') // { key: 'value' }
 * ```
 */
class BaseStorage {
  storageAdapter: Storage

  constructor(storageAdapter: Storage) {
    this.storageAdapter = storageAdapter
  }

  /**
   * Retrieves an item. Tries to parse the item as JSON before returning it. The item is returned as-is (i.e. as a string) if that fails. Returns `null` if no item for `storageKey` was found.
   */
  get(storageKey: StorageKeyValues): any {
    let item: string | null

    // Guards storage access because it can throw when it’s full or strict cookie protection rules are in place.
    try {
      item = this.storageAdapter.getItem(storageKey)
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
  }

  /**
   * Stores an item. Objects (and arrays) are turned into strings using `JSON.stringify`.
   */
  set(storageKey: StorageKeyValues, value: string | object): void {
    try {
      const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)

      this.storageAdapter.setItem(storageKey, stringifiedValue)
    } catch {}
  }

  has(storageKey: StorageKeyValues): boolean {
    try {
      return this.storageAdapter.getItem(storageKey) !== null
    } catch {
      return false
    }
  }

  remove(storageKey: StorageKeyValues): void {
    try {
      this.storageAdapter.removeItem(storageKey)
    } catch {}
  }
}

export const ClientStorage = new BaseStorage(window.localStorage)
