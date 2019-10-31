/**
  Default form page mixins

  Requires:
  - `resourceEndpoint` - resource endpoint

  Optional:
  - `id` - resource identifier

  Provides:
  - `isEditing` - `true` when `id` exists
  - `redirectRoute` - route to redirect to, defaults to `{ name: <resourceEndpoint> }`.
  - `buttonText` - `Update` or `Create` depending on `isEditing`
  - `onDeleteWhenEditing` - return `onDelete` method when `isEditing`
  - `onFormLoad` - handler for `onLoad` callback of `EntityForm`
  - `onFormSubmit` - handler for `onSubmit` callback of `EntityForm`
  - `onFormDelete` - handler for `onDelete` callback of `EntityForm`
  - `getRecord` - method to retrieve resource record
  - `createRecord` - method to create a resource record
  - `updateRecord` - method to update a resource record
  - `deleteRecord` - method to delete a resource record
  - `transformRecord` - method to transform a resource record before update and create
*/
import { redirectOnResponseStatus } from '@/helpers'

export default {
  computed: {
    isEditing () {
      return !!this.id
    },

    buttonText () {
      return this.isEditing ? 'Update' : 'Create'
    },

    /**
     * @returns {Promise}
     */
    onDeleteWhenEditing () {
      return this.isEditing ? this.onFormDelete : () => new Promise((resolve) => resolve())
    },

    redirectRoute () {
      return { name: this.resourceEndpoint }
    }
  },

  methods: {
    onFormLoad () {
      return Promise.resolve(this.id ? this.getRecord() : false)
        .catch(redirectOnResponseStatus(this.$router, 404, '/404', { replace: true }))
    },

    async onFormSubmit (model, callback = this.redirectRoute) {
      let record = this.transformRecord(model)

      return await this.isEditing
        ? this.updateRecord(record)
        : this.createRecord(record, callback)
    },

    onFormDelete () {
      return this.deleteRecord()
    },

    getRecord () {
      return this.$api.findRecord(this.resourceEndpoint, this.id)
    },

    /**
     * @param {Object} model - form model
     * @param {RawLocation|Function} callback - vue router location or function
     *  to calculate the vue router location from the response
     */
    createRecord (model, callback) {
      return this.$api.createRecord(this.resourceEndpoint, model)
        .then(res => {
          const location = typeof callback === 'function' &&
            callback(model, res.data) || callback

          return redirectOnResponseStatus(this.$router, 201, location)(res)
        })
    },

    updateRecord (model) {
      return this.$api.updateRecord(this.resourceEndpoint, this.id, model)
        .then(res => {
          const link = this.returnLink || this.$route.params.returnLink
          if (link) {
            return this.$router.push({ path: link })
          }

          redirectOnResponseStatus(this.$router, 200, { name: this.resourceEndpoint })(res)
        })
    },

    deleteRecord () {
      return this.$api.deleteRecord(this.resourceEndpoint, this.id)
        .then(redirectOnResponseStatus(this.$router, 204, this.redirectRoute, { replace: true }))
    },

    transformRecord (model) {
      return model
    }
  }
}
