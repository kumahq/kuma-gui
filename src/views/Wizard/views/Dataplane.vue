<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="steps"
        :advance-check="true"
        :sidebar-content="sidebarContent"
        :footer-enabled="scanFound === false"
        :next-disabled="nextDisabled"
      >
        <!-- step content -->
        <template slot="general">
          <p>
            Welcome to the wizard to create a new Dataplane entity in {{ title }}.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the Kuma GUI is read-only.
          </p>

          <KEmptyState
            :is-error="!environment"
            class="my-6 empty-state--wide-content"
          >
            <template
              v-if="environment === 'kubernetes' || environment === 'universal'"
              slot="title"
            >
              Running on {{ environment }}
            </template>
            <template slot="message">
              <p v-if="environment === 'kubernetes'">
                We have detected you are running on a <strong>Kubernetes environment</strong>, and we
                are going to be showing you instructions for Kubernetes unless you
                decide to visualize the instructions for Universal.
              </p>
              <p v-else-if="environment === 'universal'">
                We have detected you are running on a <strong>Universal environment</strong>, and we
                are going to be showing you instructions for Universal, unless you
                decide to visualize the instructions for Kubernetes.
              </p>
              <p v-else>
                We were unable to determine your environment.
              </p>
            </template>
            <template slot="cta">
              <KButton
                v-if="environment"
                appearance="primary"
              >
                {{ instructionsCtaText }}
              </KButton>
            </template>
          </KEmptyState>

          <h3>
            To get started, please select on what Mesh you would like to add the Dataplane:
          </h3>

          <KCard
            class="my-6"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                title="Mesh"
                for-attr="dp-mesh"
                all-inline
              >
                <div>
                  <select
                    id="dp-mesh"
                    class="k-input w-100"
                    @change="updateStorage('dpMesh', $event.target.value)"
                  >
                    <option
                      v-for="item in meshes.items"
                      :key="item.name"
                      :value="item.name"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <KButton
                    :to="{ path: '/wizard/mesh' }"
                    appearance="primary"
                  >
                    Create a new Mesh
                  </KButton>
                </div>
                <!-- <KAlert
                  v-if="vmsg.meshName"
                  appearance="danger"
                  size="small"
                  :alert-message="vmsg.meshName"
                /> -->
              </FormFragment>

              <FormFragment
                v-if="formConditions.mtlsEnabled === true"
                title="Certificate Authority"
                for-attr="certificate-authority"
              >
                <select
                  id="certificate-authority"
                  class="k-input w-100"
                  name="certificate-authority"
                  @change="updateStorage('meshCA', $event.target.value)"
                >
                  <option
                    value="builtin"
                    :selected="(getStorageItem('meshCA') === 'builtin') ? true : false"
                  >
                    builtin
                  </option>
                  <option
                    value="provided"
                    :selected="(getStorageItem('meshCA') === 'provided') ? true : false"
                  >
                    provided
                  </option>
                  <option
                    value="vault"
                    :selected="(getStorageItem('meshCA') === 'vault') ? true : false"
                  >
                    vault
                  </option>
                </select>
                <p class="help">
                  If you've enabled mTLS, you must select a CA.
                </p>
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template slot="scope-settings">
          <h3>
            Setup Logging
          </h3>
          <p>
            You can setup as many logging backends as you need that you can later
            use to log traffic via the &quot;TrafficLog&quot; policy. In this wizard,
            we allow you to configure one backend, but you can add more manually
            if you wish.
          </p>
          <KCard
            class="my-6 k-card--small"
            title="Logging Configuration"
            has-shadow
          >
            <template slot="body">
              <FormFragment title="Logging">
                <label class="k-input-label mx-2">
                  <input
                    id="logging-disabled"
                    value="disabled"
                    name="logging"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.loggingEnabled === false"
                    @change="updateStorage('meshLoggingStatus', false); formConditions.loggingEnabled = false"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="logging-enabled"
                    value="enabled"
                    name="logging"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.loggingEnabled === true"
                    @change="
                      updateStorage('meshLoggingStatus', true);
                      updateStorage('meshLoggingType', 'tcp');
                      formConditions.loggingEnabled = true
                      formConditions.loggingType = 'tcp'"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>
              <FormFragment
                v-if="formConditions.loggingEnabled === true"
                title="Backend name"
              >
                <input
                  id="backend-name"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-backend-name"
                  :value="getStorageItem('meshLoggingBackend')"
                  @change="updateStorage('meshLoggingBackend', $event.target.value)"
                >
              </FormFragment>
              <div v-if="formConditions.loggingEnabled === true">
                <FormFragment title="Type">
                  <select
                    id="logging-type"
                    ref="loggingTypeSelect"
                    class="k-input w-100"
                    name="logging-type"
                    @change="updateStorage('meshLoggingType', $event.target.value); formConditions.loggingType = $event.target.value"
                  >
                    <option
                      value="tcp"
                      :selected="(getStorageItem('meshLoggingType') === 'tcp') ? true : false"
                    >
                      TCP
                    </option>
                    <option
                      value="file"
                      :selected="(getStorageItem('meshLoggingType') === 'file') ? true : false"
                    >
                      File
                    </option>
                  </select>
                </FormFragment>
                <!-- if the format type is File -->
                <FormFragment
                  v-if="formConditions.loggingType === 'file'"
                  title="Path"
                  for-attr="backend-address"
                >
                  <input
                    id="backend-address"
                    type="text"
                    class="k-input w-100"
                    :value="getStorageItem('meshLoggingPath')"
                    @change="updateStorage('meshLoggingPath', $event.target.value)"
                  >
                </FormFragment>
                <!-- if the format type is TCP -->
                <FormFragment
                  v-if="formConditions.loggingType === 'tcp'"
                  title="Address"
                  for-attr="backend-address"
                >
                  <input
                    id="backend-address"
                    type="text"
                    class="k-input w-100"
                    :value="getStorageItem('meshLoggingAddress') || '127.0.0.1:5000'"
                    @change="updateStorage('meshLoggingAddress', $event.target.value)"
                  >
                </FormFragment>
                <FormFragment
                  title="Format"
                  for-attr="backend-format"
                >
                  <textarea
                    id="backend-format"
                    class="k-input w-100 code-sample"
                    rows="12"
                    @change="updateStorage('meshLoggingBackendFormat', ($event.target.value).trim())"
                  >
                    { "start_time": "%START_TIME%", "source": "%KUMA_SOURCE_SERVICE%", "destination": "%KUMA_DESTINATION_SERVICE%", "source_address": "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", "destination_address": "%UPSTREAM_HOST%", "duration_millis": "%DURATION%", "bytes_received": "%BYTES_RECEIVED%", "bytes_sent": "%BYTES_SENT%" }
                    </textarea>
                </FormFragment>
              </div>
            </template>
          </KCard>
        </template>
        <template slot="complete">
          <div v-if="codeOutput">
            <div v-if="scanFound === false">
              <h3>
                Install a new Mesh
              </h3>
              <p>
                Since the Kuma GUI is read-only mode to follow Ops best practices,
                please execute the following command in your shell to create the entity.
                Kuma will automatically detect when the new entity has been created.
              </p>
              <Tabs
                :loaders="false"
                :tabs="tabs"
                :has-border="true"
                :initial-tab-override="environment"
              >
                <template slot="kubernetes">
                  <CodeView
                    title="Kubernetes"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template>
                <template slot="universal">
                  <CodeView
                    title="Universal"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template>
              </Tabs>
            </div>
            <Scanner
              :loader-function="scanForEntity"
              :should-start="true"
              :has-error="scanError"
              :can-complete="scanFound"
            >
              <!-- loading -->
              <template slot="loading-title">
                <h3>Searching&hellip;</h3>
              </template>
              <template slot="loading-content">
                <p>We are looking for your mesh.</p>
              </template>
              <!-- complete -->
              <template slot="complete-title">
                <h3>Done!</h3>
              </template>
              <template slot="complete-content">
                <p>
                  Your Mesh <strong v-if="formData.meshName">{{ formData.meshName }}</strong> was found!
                </p>
                <p>
                  <KButton
                    appearance="primary"
                    :to="{ name: 'all-meshes' }"
                  >
                    See Meshes
                  </KButton>
                </p>
              </template>
              <!-- error -->
              <template slot="error-title">
                <h3>Mesh not found</h3>
              </template>
              <template slot="error-content">
                <p>We were unable to find your mesh.</p>
              </template>
            </Scanner>
          </div>
          <KAlert
            v-else
            appearance="danger"
          >
            <template slot="alertMessage">
              <p>
                You haven't filled any data out yet! Please return to the first
                step and fill out your information.
              </p>
            </template>
          </KAlert>
        </template>

        <!-- sidebar content -->
        <template slot="dataplane">
          <h3>Dataplane</h3>
          <p>
            In {{ title }}, a Dataplane entity represents a sidebar proxy running
            alongside one of your services. Dataplanes can be added in any Mesh
            that you may have created, and in Kubernetes, they will be auto-injected
            by {{ title }}.
          </p>
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { rejectKeys } from '@/views/Wizard/helpers'
import updateStorage from '@/views/Wizard/mixins/updateStorage'
import FormatForCLI from '@/mixins/FormatForCLI'
import FormFragment from '@/views/Wizard/components/FormFragment'
import Tabs from '@/components/Utils/Tabs'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton'
import CodeView from '@/components/Skeletons/CodeView'
import Scanner from '@/views/Wizard/components/Scanner'

// schema for building code output
import meshSchema from '@/views/Wizard/schemas/Mesh'

export default {
  name: 'DataplaneWizard',
  metaInfo: {
    title: 'Create a new Mesh'
  },
  components: {
    FormFragment,
    Tabs,
    StepSkeleton,
    CodeView,
    Scanner
  },
  mixins: [
    FormatForCLI,
    updateStorage
  ],
  data () {
    return {
      schema: meshSchema,
      steps: [
        {
          label: 'General',
          slug: 'general'
        },
        {
          label: 'Scope Settings',
          slug: 'scope-settings'
        },
        {
          label: 'Install',
          slug: 'complete'
        }
      ],
      tabs: [
        {
          hash: '#kubernetes',
          title: 'Kubernetes'
        },
        {
          hash: '#universal',
          title: 'Universal'
        }
      ],
      sidebarContent: [
        {
          name: 'dataplane'
        }
      ],
      formConditions: {
        mtlsEnabled: false,
        loggingEnabled: false,
        tracingEnabled: false,
        metricsEnabled: false,
        loggingType: null
      },
      startScanner: false,
      scanFound: false,
      scanError: false,
      isComplete: false,
      nextDisabled: false,
      validate: {
        meshName: '',
        meshLoggingBackend: ''
      },
      vmsg: []
    }
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      version: 'getVersion',
      environment: 'getEnvironment',
      formData: 'getStoredWizardData',
      selectedTab: 'getSelectedTab',
      meshes: 'getMeshList'
    }),

    instructionsCtaText () {
      return (this.environment === 'universal')
        ? 'Switch to Kubernetes instructions'
        : 'Switch to Universal instructions'
    },

    // this exists because the browser is stubborn and holds onto this
    // data even if it's not present in localStorage
    getCleanMeshName () {
      const data = this.$store.getters.getStoredWizardData

      if (data) {
        return data.meshName
      } else {
        return null
      }
    },

    // Our generated code output
    codeOutput () {
      const schema = this.schema
      const schemaNew = Object.assign({}, schema)
      const newData = this.formData

      // if there is no data set yet, do nothing
      if (!newData) return

      /**
       * Assign new values to our schema
       */

      // conditionals
      const hasMtls = newData.meshMtls || false
      const hasLogging = newData.meshLoggingStatus || false
      const hasTracing = newData.meshTracingStatus || false
      const hasMetrics = newData.meshMetricsStatus || false

      // filter options
      const featureStatus = {
        mtls: hasMtls,
        logging: hasLogging,
        tracing: hasTracing,
        metrics: hasMetrics
      }

      // define the features we are going to omit from our object
      const filteredFeatures = []

      Object.entries(featureStatus).forEach(r => {
        const condition = r[1]
        const value = r[0]

        if (condition) {
          filteredFeatures.filter(i => i !== value)
        } else {
          filteredFeatures.push(value)
        }
      })

      /**
       * mTLS
       */
      if (hasMtls) {
        schemaNew.spec.mtls.enabled = true
        schemaNew.spec.mtls.ca = {
          [newData.meshCA || 'builtin']: {}
        }
      }

      /**
       * Logging
       */

      if (hasLogging) {
        const loggingObj = schemaNew.spec.logging.backends[0]
        const fallbackFormat = loggingObj.format

        loggingObj.name = newData.meshLoggingBackend
        loggingObj.format = newData.meshLoggingBackendFormat || fallbackFormat

        if (newData.meshLoggingType === 'tcp') {
          if (loggingObj.file) {
            delete loggingObj.file
          }

          loggingObj.tcp = {
            address: newData.meshLoggingAddress || '127.0.0.1:5000'
          }
        } else if (newData.meshLoggingType === 'file') {
          if (loggingObj.tcp) {
            delete loggingObj.tcp
          }

          loggingObj.file = {
            path: newData.meshLoggingPath
          }
        }
      }

      /**
       * Tracing
       */
      if (hasTracing) {
        const tracingObj = schemaNew.spec.tracing

        tracingObj.defaultBackend = newData.meshTracingBackend
        tracingObj.backends[0].name = newData.meshTracingBackend
        tracingObj.backends[0].sampling = newData.meshTracingSampling || 100
        tracingObj.backends[0].zipkin.url = newData.meshTracingZipkinURL
      }

      /**
       * Metrics
       */
      if (hasMetrics) {
        const metricsObj = schemaNew.spec.metrics

        metricsObj.prometheus.port = newData.meshMetricsDataplanePort || 5670
        metricsObj.prometheus.path = newData.meshMetricsDataplanePath || '/metrics'
      }

      // now we clean up our output based on the above conditions
      const schemaClean = rejectKeys(schemaNew.spec, filteredFeatures)

      // Type and Name
      let meshType

      if (this.selectedTab === '#kubernetes') {
        // Kubernetes
        meshType = {
          apiVersion: 'kuma.io/v1alpha1',
          kind: 'Mesh',
          metadata: {
            name: newData.meshName
          }
        }
      } else {
        // Universal
        meshType = {
          type: 'Mesh',
          name: newData.meshName
        }
      }

      /**
       * Finalized output
       */

      let codeBlock

      if (this.selectedTab === '#kubernetes') {
        codeBlock = { ...meshType, spec: { ...schemaClean } }
      } else {
        codeBlock = { ...meshType, ...schemaClean }
      }

      const assembledBlock = this.formatForCLI(codeBlock)

      return assembledBlock
    }
  },
  watch: {
    'validate.meshName' (value) {
      this.validate.meshName = value
      this.validateMeshName(value)
    }
  },
  mounted () {
    // this ensures the Wizard tab is actively set based on
    // the user's Kuma environment (Universal or Kubernetes)
    this.$store.dispatch('updateSelectedTab', `#${this.environment}`)
  },
  methods: {
    validateMeshName (value) {
      if (!value || value === '') {
        this.vmsg.meshName = 'A Mesh name is required to proceed'
        this.nextDisabled = true
      } else {
        this.vmsg.meshName = ''
        this.nextDisabled = false
      }
    },
    scanForEntity () {
      // get our entity from the VueX store
      const entity = this.$store.getters.getStoredWizardData.meshName

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there's nothing found
      if (!entity) return

      /**
       * TODO
       * this will eventually change to `this.$api.getDataplaneFromMesh()`
       * we will need to get the Mesh namespace the user selects, or the one
       * they create, as well as the Dataplane namespace.
       */
      this.$api.getMesh(entity)
        .then(response => {
          if (response && response.name.length > 0) {
            this.isRunning = true
            this.scanFound = true
          } else {
            this.scanError = true
          }
        })
        .catch(error => {
          this.scanError = true

          console.error(error)
        })
        .finally(() => {
          this.scanComplete = true
        })
    }
  }
}
</script>
