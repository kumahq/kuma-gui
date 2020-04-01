/**
 * updateStorage
 *
 * This mixin will let add items and values to localStorage
 * for use with Wizard flow.
 *
 */
export default {
  methods: {
    updateStorage (key, value, remove = null) {
      // remove from storage
      if (remove) {
        localStorage.removeItem(remove)
      }

      // add (or update) item in/to localStorage
      if (key && value) {
        localStorage.setItem(key, value)
      }
    },
    getStorageItem (value) {
      return localStorage.getItem(value)
    }
  }
}
