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
        this.$emit('storageItemRemoved', remove)
      }

      // add (or update) item in/to localStorage
      if (key && value) {
        localStorage.setItem(key, value)
        this.$emit('storageItemModified', value)
      }
    },
    getStorageItem (value) {
      this.$emit('storageItemRetrieved', value)

      return localStorage.getItem(value)
    }
  }
}
