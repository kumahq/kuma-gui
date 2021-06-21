<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="steps"
        :advance-check="true"
        :sidebar-content="sidebarContent"
        :footer-enabled="hideScannerSiblings === false"
        :next-disabled="nextDisabled"
      >
        <!-- step content -->
        <template slot="general">
          <p>
            Welcome to the wizard for creating a new Mesh resource in {{ $productName }}.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the {{ $productName }} GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <code>kubectl</code> (if you are running in Kubernetes mode) or
            <code>kumactl</code> / API (if you are running in Universal mode).
          </p>

          <h3>
            To get started, please fill in the following information:
          </h3>

          <KCard
            class="my-6 k-card--small"
            title="Mesh Information"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                title="Mesh name"
                for-attr="mesh-name"
              >
                <input
                  id="mesh-name"
                  v-model="validate.meshName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-mesh-name"
                  required
                  @change="updateStorage('meshName', $event.target.value)"
                >
                <KAlert
                  v-if="vmsg.meshName"
                  appearance="danger"
                  size="small"
                  :alert-message="vmsg.meshName"
                />
              </FormFragment>

              <FormFragment title="Mutual TLS">
                <label class="k-input-label mx-2">
                  <input
                    ref="mtlsDisabled"
                    value="disabled"
                    name="mtls"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.mtlsEnabled === false"
                    @change="
                      updateStorage('meshMtls', false);
                      formConditions.mtlsEnabled = false"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="mtls-enabled"
                    value="enabled"
                    name="mtls"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.mtlsEnabled === true"
                    @change="
                      updateStorage('meshMtls', true);
                      updateStorage('meshCA', 'builtin');
                      formConditions.mtlsEnabled = true"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="formConditions.mtlsEnabled === true"
                title="Certificate name"
              >
                <input
                  id="certificate-name"
                  v-model="validate.meshCAName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-certificate-name"
                  @change="updateStorage('meshCAName', $event.target.value)"
                >
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
        <template slot="logging">
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
                  v-model="validate.meshLoggingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-backend-name"
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
        <template slot="tracing">
          <h3>
            Setup Tracing
          </h3>
          <p>
            You can setup as many tracing backends as you need that you can later
            use to log traffic via the &quot;TrafficTrace&quot; policy. In this
            wizard we allow you to configure one backend, but you can add more
            manually as you wish.
          </p>
          <KCard
            class="my-6 k-card--small"
            title="Tracing Configuration"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                title="Tracing"
              >
                <label class="k-input-label mx-2">
                  <input
                    id="tracing-disabled"
                    value="disabled"
                    name="tracing"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.tracingEnabled === false"
                    @change="updateStorage('meshTracingStatus', false); formConditions.tracingEnabled = false"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="tracing-enabled"
                    value="enabled"
                    name="tracing"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.tracingEnabled === true"
                    @change="
                      updateStorage('meshTracingStatus', true);
                      updateStorage('meshTracingType', 'zipkin')
                      formConditions.tracingEnabled = true"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="formConditions.tracingEnabled === true"
                title="Backend name"
                for-attr="tracing-backend-name"
              >
                <input
                  id="tracing-backend-name"
                  v-model="validate.meshTracingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-tracing-backend-name"
                  @change="updateStorage('meshTracingBackend', $event.target.value)"
                >
              </FormFragment>

              <FormFragment
                v-if="formConditions.tracingEnabled === true"
                title="Type"
                for-attr="tracing-type"
              >
                <select
                  id="tracing-type"
                  class="k-input w-100"
                  name="tracing-type"
                  @change="updateStorage('meshTracingType', $event.target.value)"
                >
                  <option
                    value="zipkin"
                    :selected="(getStorageItem('meshTracingType') === 'zipkin') ? true : false"
                  >
                    Zipkin
                  </option>
                </select>
              </FormFragment>

              <FormFragment
                v-if="formConditions.tracingEnabled === true"
                title="Sampling"
                for-attr="tracing-sampling"
              >
                <input
                  id="tracing-sampling"
                  type="number"
                  class="k-input w-100"
                  :value="getStorageItem('meshTracingSampling') || 99.9"
                  step="0.1"
                  min="0"
                  max="100"
                  @change="updateStorage('meshTracingSampling', $event.target.value)"
                >
              </FormFragment>

              <FormFragment
                v-if="formConditions.tracingEnabled === true"
                title="URL"
                for-attr="tracing-zipkin-url"
              >
                <input
                  id="tracing-zipkin-url"
                  type="text"
                  class="k-input w-100"
                  placeholder="http://zipkin.url:1234"
                  :value="getStorageItem('meshTracingZipkinURL')"
                  @change="updateStorage('meshTracingZipkinURL', $event.target.value)"
                >
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template slot="metrics">
          <h3>
            Setup Metrics
          </h3>
          <p>
            You can expose metrics from every data-plane on a configurable path
            and port that a metrics service, like Prometheus, can use to fetch them.
          </p>
          <KCard
            class="my-6 k-card--small"
            title="Metrics Configuration"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                title="Metrics"
              >
                <label class="k-input-label mx-2">
                  <input
                    id="metrics-disabled"
                    value="disabled"
                    name="metrics"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.metricsEnabled === false"
                    @change="updateStorage('meshMetricsStatus', false); formConditions.metricsEnabled = false"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="metrics-enabled"
                    value="enabled"
                    name="metrics"
                    type="radio"
                    class="k-input mr-2"
                    :checked="formConditions.metricsEnabled === true"
                    @change="
                      updateStorage('meshMetricsStatus', true);
                      updateStorage('meshMetricsType', 'prometheus')
                      formConditions.metricsEnabled = true"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>
              <FormFragment
                v-if="formConditions.metricsEnabled === true"
                title="Backend name"
              >
                <input
                  id="metrics-name"
                  v-model="validate.meshMetricsName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-metrics-backend-name"
                  @change="updateStorage('meshMetricsName', $event.target.value)"
                >
              </FormFragment>
              <FormFragment
                v-if="formConditions.metricsEnabled === true"
                title="Type"
                for-attr="metrics-type"
              >
                <select
                  id="metrics-type"
                  class="k-input w-100"
                  name="metrics-type"
                  @change="updateStorage('meshMetricsType', $event.target.value)"
                >
                  <option
                    value="prometheus"
                    :selected="(getStorageItem('meshMetricsType') === 'prometheus') ? true : false"
                  >
                    Prometheus
                  </option>
                </select>
              </FormFragment>
              <FormFragment
                v-if="formConditions.metricsEnabled === true"
                title="Dataplane port"
                for-attr="metrics-dataplane-port"
              >
                <input
                  id="metrics-dataplane-port"
                  type="number"
                  class="k-input w-100"
                  step="1"
                  min="0"
                  max="65535"
                  placeholder="1234"
                  :value="getStorageItem('meshMetricsDataplanePort') || '5670'"
                  @change="updateStorage('meshMetricsDataplanePort', $event.target.value)"
                >
              </FormFragment>
              <FormFragment
                v-if="formConditions.metricsEnabled === true"
                title="Dataplane path"
                for-attr="metrics-dataplane-path"
              >
                <input
                  id="metrics-dataplane-path"
                  type="text"
                  class="k-input w-100"
                  :value="getStorageItem('meshMetricsDataplanePath') || '/metrics'"
                  @change="updateStorage('meshMetricsDataplanePath', $event.target.value)"
                >
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template slot="complete">
          <div v-if="codeOutput">
            <div v-if="hideScannerSiblings === false">
              <h3>
                Install a new Mesh
              </h3>
              <p>
                Since the {{ $productName }} GUI is read-only mode to follow Ops best practices,
                please execute the following command in your shell to create the entity.
                {{ $productName }} will automatically detect when the new entity has been created.
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
              @hideSiblings="hideSiblings"
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
        <template slot="mesh">
          <h3>Mesh</h3>
          <p>
            In {{ title }}, a Mesh resource allows you to define an isolated environment
            for your data-planes and policies. It's isolated because the mTLS CA
            you choose can be different from the one configured for our Meshes.
            Ideally, you will have either a large Mesh with all the workloads, or
            one Mesh per application for better isolation.
          </p>
          <p>
            <a
              :href="`https://kuma.io/docs/${version}/policies/mesh/${utm}`"
              target="_blank"
            >
              Learn More
            </a>
          </p>
        </template>
        <template slot="did-you-know">
          <h3>Did You Know?</h3>
          <p>
            As you know, the GUI is read-only, but it will be providing instructions
            to create a new Mesh and verify everything worked well.
          </p>
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { rejectKeys } from '@/views/Wizard/helpers'
import { kebabCase } from '@/helpers'
import FormatForCLI from '@/mixins/FormatForCLI'
import updateStorage from '@/views/Wizard/mixins/updateStorage'
import FormFragment from '@/views/Wizard/components/FormFragment'
import Tabs from '@/components/Utils/Tabs'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton'
import CodeView from '@/components/Skeletons/CodeView'
import Scanner from '@/views/Wizard/components/Scanner'

// schema for building code output
import meshSchema from '@/views/Wizard/schemas/Mesh'

export default {
  name: 'MeshWizard',
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
          label: 'General & Security',
          slug: 'general'
        },
        {
          label: 'Logging',
          slug: 'logging'
        },
        {
          label: 'Tracing',
          slug: 'tracing'
        },
        {
          label: 'Metrics',
          slug: 'metrics'
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
          name: 'mesh'
        },
        {
          name: 'did-you-know'
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
      hideScannerSiblings: false,
      scanError: false,
      isComplete: false,
      nextDisabled: true,
      validate: {
        meshName: '',
        meshCAName: '',
        meshLoggingBackend: '',
        meshTracingBackend: '',
        meshMetricsName: ''
      },
      vmsg: [],
      utm: process.env.VUE_APP_UTM
    }
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      version: 'getVersion',
      environment: 'getEnvironment',
      formData: 'getStoredWizardData',
      selectedTab: 'getSelectedTab'
    }),

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
        schemaNew.mtls.enabled = true
        const mtlsObject = schemaNew.mtls
        const certAuth = this.formData.meshCA
        const certName = this.formData.meshCAName

        mtlsObject.backends = []

        mtlsObject.enabledBackend = certName

        if (certAuth === 'provided') {
          mtlsObject.backends = [
            {
              name: certName,
              type: certAuth,
              conf: {
                cert: {
                  secret: ''
                },
                key: {
                  secret: ''
                }
              }
            }
          ]
        } else {
          mtlsObject.backends = [
            {
              name: certName,
              type: certAuth
            }
          ]
        }
      }

      /**
       * Logging
       */

      if (hasLogging) {
        const loggingObj = schemaNew.logging.backends[0]
        const fallbackFormat = loggingObj.format

        loggingObj.conf = {}

        loggingObj.name = newData.meshLoggingBackend
        loggingObj.type = newData.meshLoggingType
        loggingObj.format = newData.meshLoggingBackendFormat || fallbackFormat

        if (newData.meshLoggingType === 'tcp') {
          loggingObj.conf.address = newData.meshLoggingAddress || '127.0.0.1:5000'
        } else if (newData.meshLoggingType === 'file') {
          loggingObj.conf.path = newData.meshLoggingPath
        }
      }

      /**
       * Tracing
       */
      if (hasTracing) {
        const tracingObj = schemaNew.tracing

        tracingObj.backends[0].conf = {}

        tracingObj.defaultBackend = newData.meshTracingBackend
        tracingObj.backends[0].type = newData.meshTracingType || 'zipkin'
        tracingObj.backends[0].name = newData.meshTracingBackend
        tracingObj.backends[0].conf.sampling = newData.meshTracingSampling || 100
        tracingObj.backends[0].conf.url = newData.meshTracingZipkinURL
      }

      /**
       * Metrics
       */
      if (hasMetrics) {
        const metricsObj = schemaNew.metrics

        metricsObj.backends[0].conf = {}

        metricsObj.enabledBackend = newData.meshMetricsName
        metricsObj.backends[0].type = newData.meshMetricsType || 'prometheus'
        metricsObj.backends[0].name = newData.meshMetricsName
        metricsObj.backends[0].conf.port = newData.meshMetricsDataplanePort || 5670
        metricsObj.backends[0].conf.path = newData.meshMetricsDataplanePath || '/metrics'
      }

      // now we clean up our output based on the above conditions
      const schemaClean = rejectKeys(schemaNew, filteredFeatures)

      // Mesh yaml creation
      let meshYaml

      if (this.selectedTab === '#kubernetes') {
        // Kubernetes
        meshYaml = {
          apiVersion: 'kuma.io/v1alpha1',
          kind: 'Mesh',
          metadata: {
            name: newData.meshName
          },
          spec: schemaClean,
        }
      } else {
        // Universal
        meshYaml = {
          type: 'Mesh',
          name: newData.meshName,
          ...schemaClean,
        }
      }

      /**
       * Finalized output
       */

      const cliConditionCode = () => {
        if (this.selectedTab === '#kubernetes') {
          return this.formatForCLI(meshYaml, '" | kubectl apply -f -')
        } else {
          return this.formatForCLI(meshYaml, '" | kumactl apply -f -')
        }
      }

      return cliConditionCode()
    }
  },
  watch: {
    // mesh name
    'validate.meshName' (value) {
      const newName = kebabCase(value)

      this.validate.meshName = newName
      this.validateMeshName(newName)
    },
    // mesh cert name
    'validate.meshCAName' (value) {
      this.validate.meshCAName = kebabCase(value)
    },
    // mesh logging backend name
    'validate.meshLoggingBackend' (value) {
      this.validate.meshLoggingBackend = kebabCase(value)
    },
    // mesh tracing backend name
    'validate.meshTracingBackend' (value) {
      this.validate.meshTracingBackend = kebabCase(value)
    },
    'validate.meshMetricsName' (value) {
      this.validate.meshMetricsName = kebabCase(value)
    }
  },
  mounted () {
    // this ensures the Wizard tab is actively set based on
    // the user's Kuma environment (Universal or Kubernetes)
    this.$store.dispatch('updateSelectedTab', `#${this.environment}`)
  },
  methods: {
    hideSiblings () {
      // this triggers when to hide the siblings related to the Scanner
      // component that need to be hidden once the scan succeeds.
      this.hideScannerSiblings = true
    },
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

      // this.$api.getMesh(entity)
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
