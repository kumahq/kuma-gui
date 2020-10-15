import { mapState } from 'vuex'
import EntityButton from '@/components/EntityButton'
import { convertToDotNotation, capitalize } from '@/helpers'
import customFields from '@/plugins/vfg/index'

function buildCustomFields (customFields, schema) {
  return customFields.reduce((acc, customField) => {
    if (schema[customField] && schema[customField].fields) {
      schema[customField].fields.forEach(field => {
        if (field.fields) {
          field.fields.forEach(subField => {
            acc[subField.model] = subField
          })
        }

        if (field.model) acc[field.model] = field
      })
    }

    return acc
  }, {})
}

function setFieldDefaultValue (schema) {
  return Array.isArray(schema.default) || (schema.default != null &&
    typeof schema.default !== 'object' &&
    schema.default !== 'function')
}

/**
 * Format field label
 * @param {Object} schema - vue-form-generator schema
 * @param {string} fieldName - form field name
 * @returns {string}
 */
function formatFieldLabel (schema, fieldName) {
  if (schema.inputType === 'hidden') {
    // Remove field label or return dot notion label
    return ''

    // When the field is not hidden convert the field name to display the exact same way
    // it is documented (dot notation), not the way it is referenced in the DOM or in code.
    // This can be overridden in the field schema
  } else {
    return convertToDotNotation(schema.label || fieldName)
  }
}

export default {

  components: { EntityButton },

  computed: {
    ...mapState('workspaces', {
      workspace: state => state.workspace
    }),
    ...mapState('auth', {
      perms: state => state.permissions
    })
  },

  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        window.scrollTo({
          top: document.body.clientHeight - window.innerHeight,
          left: 0,
          behavior: 'smooth'
        })
      })
    },

    /**
     * a list of form fields not to render across all entity forms
     * @returns {Array} an array of form fields not to render across all entity forms
     */
    getBlacklist () {
      return ['created_at', 'updated_at', 'id']
    },

    /**
     * this method takes in two schema objects, and merges them; if two fields are the same it will use the frontend properties as the override
     * @param {Object} frontendSchema
     * @param {Object} backendSchema
     * @returns {Object} an object representing the combined inputSchema - which will be consumed by the parseSchema method
     */
    mergeSchema (frontendSchema, backendSchema) {
      const inputSchema = {}

      Object.keys(backendSchema).forEach(key => {
        const field = backendSchema[key]

        inputSchema[key] = field
        inputSchema[key].label = capitalize(key.replace('_', ' '))

        if (field.type === 'string') {
          inputSchema[key].type = 'input'
          inputSchema[key].inputType = 'text'
        }

        if (field.type === 'set') {
          inputSchema[key].type = 'input'
          inputSchema[key].inputType = 'text'
          inputSchema[key].valueType = 'array'
          inputSchema[key].valueArrayType = 'string'
        }

        if (frontendSchema[key]) {
          Object.assign(inputSchema[key], frontendSchema[key])
        }
      })

      return inputSchema
    },

    /**
     * this method takes in a combined inputSchema and outputs an object containing a model and a schema for VFG form consumption
     * @param {Object} schema the combined inputSchema (which is the result of the mergeSchema method)
     * @returns {Object} an object containing a formModel and formSchema, both of which will be consumed by the VFG form generator
     */
    parseSchema (schema) {
      let inputSchema = {}
      if (schema || this.schema) {
        inputSchema = schema || (this.schema.fields ? this.schema.fields : this.schema)
      }

      const blacklist = this.getBlacklist().concat(this.schema ? this.schema.blacklist : [])

      const inputSchemaFields = Object.keys(inputSchema).filter(f => !blacklist.includes(f))

      // Comparator function for comparing schema objects should not be added to fields
      const comparatorIdx = inputSchemaFields.indexOf('comparator')

      comparatorIdx > -1 && inputSchemaFields.splice(comparatorIdx, 1)

      const formSchema = { fields: [] }
      const formModel = {}

      // Iterate over each schema field to augment with display configuration.
      inputSchemaFields.forEach(fieldName => {
        const fieldSchema = inputSchema[fieldName]
        // Check whether to update the form model with a default value for this field.
        const fieldHasDefaultValue = setFieldDefaultValue(fieldSchema, fieldName)

        // Set default value should one exist, or empty string. Existing data will replace this later.
        formModel[fieldName] = fieldHasDefaultValue ? fieldSchema.default : null

        // Set the field label
        fieldSchema.label = formatFieldLabel(fieldSchema, fieldName)
        if (!fieldSchema.label) delete fieldSchema.label
        // Update model to be field name for reference within Vue
        fieldSchema.model = fieldName

        // Get all sub-fields from custom field
        // Add each sub-field to model & Remove custom field key
        const customFieldsSchema = buildCustomFields(customFields, inputSchema)

        customFields.forEach(field => {
          Object.keys(customFieldsSchema).forEach(field => {
            const fieldHasDefaultValue = setFieldDefaultValue(customFieldsSchema[field], field)

            formModel[field] = fieldHasDefaultValue ? customFieldsSchema[field].default : null
          })
          delete formModel[field]
        })

        // Set VFG form schema
        formSchema.fields.push(fieldSchema)
      })

      return {
        schema: formSchema,
        model: formModel,
        options: {
          noneSelectedText: 'Nothing Selected...'
        }
      }
    },

    /**
     * Remove id of dot notated foreign key if null
     * @param {string} key
     * @param {string} model
     * @returns {string}
     */
    unsetNullForeignKey (key, model) {
      const keys = ['service.id', 'route.id', 'consumer.id']

      if (keys.indexOf(key) > -1 && model[key] === null) {
        delete model[key]
        model[key.replace('.id', '')] = null
      }
    }
  }
}
