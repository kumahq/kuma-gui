/**
 * updateStorage
 *
 * This mixin will let add items and values to localStorage
 * for use with Wizard flow.
 *
 */

import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      storedData: [],
      storedVal: null,
      storedKey: null
    }
  },
  mounted () {
    this.clearStorage()
  },
  methods: {
    updateStorage (key, value) {
      // add (or update) item in/to localStorage
      this.storedVal = value || null
      this.storedKey = key || null

      this.storedData = { ...this.storedData, ...{ [key]: value } }

      this.$store.dispatch('updateWizardData', this.storedData)

      this.$emit('storageItemModified', value)
    },
    getStorageItem (value) {
      const data = localStorage.storedFormData

      this.$emit('storageItemRetrieved', value)

      if (data && data.length > 0) {
        return JSON.parse(localStorage.storedFormData)[value]
      } else {
        return null
      }
    },
    clearStorage () {
      localStorage.removeItem('storedFormData')
      this.$store.dispatch('updateWizardData', null)
    }
  },
  watch: {
    storedVal () {
      const data = JSON.stringify(this.storedData)

      localStorage.storedFormData = data
    }
  }
}
