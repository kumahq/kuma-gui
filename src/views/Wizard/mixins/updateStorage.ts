import Vue from 'vue'

/**
 * updateStorage
 *
 * This mixin will let add items and values to localStorage
 * for use with Wizard flow.
 *
 */
export default Vue.extend({
  data () {
    return {
      storedData: [],
      storedVal: '',
      storedKey: ''
    }
  },
  watch: {
    storedVal () {
      const data = JSON.stringify(this.storedData)

      localStorage.storedFormData = data
    }
  },
  mounted () {
    this.clearStorage()
  },
  methods: {
    updateStorage (key: string, value: string) {
      // add (or update) item in/to localStorage
      this.storedVal = value || ''
      this.storedKey = key || ''

      this.storedData = { ...this.storedData, ...{ [key]: value } }

      this.$store.dispatch('updateWizardData', this.storedData)

      this.$emit('storageItemModified', value)
    },
    getStorageItem (value: string) {
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
  }
})
