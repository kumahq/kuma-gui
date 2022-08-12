<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="steps"
        :sidebar-content="sidebarContent"
        :footer-enabled="hideScannerSiblings === false"
        :next-disabled="nextDisabled"
      >
        <!-- step content -->
        <template #general>
          <p>
            Welcome to the wizard for creating a new Mesh resource in {{ productName }}.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the {{ productName }} GUI is read-only, so at the end of this wizard
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
            <template #body>
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
                    v-model="validate.mtlsEnabled"
                    value="disabled"
                    name="mtls"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="mtls-enabled"
                    v-model="validate.mtlsEnabled"
                    value="enabled"
                    name="mtls"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.mtlsEnabled === 'enabled'"
                title="Certificate name"
                for-attr="certificate-name"
              >
                <input
                  id="certificate-name"
                  v-model="validate.meshCAName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-certificate-name"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.mtlsEnabled === 'enabled'"
                title="Certificate Authority"
                for-attr="certificate-authority"
              >
                <select
                  id="certificate-authority"
                  v-model="validate.meshCA"
                  class="k-input w-100"
                  name="certificate-authority"
                >
                  <option value="builtin">
                    builtin
                  </option>
                  <option value="provided">
                    provided
                  </option>
                </select>
                <p class="help">
                  If you've enabled mTLS, you must select a CA.
                </p>
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template #logging>
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
            <template #body>
              <FormFragment title="Logging">
                <label class="k-input-label mx-2">
                  <input
                    id="logging-disabled"
                    v-model="validate.loggingEnabled"
                    value="disabled"
                    name="logging"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="logging-enabled"
                    v-model="validate.loggingEnabled"
                    value="enabled"
                    name="logging"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>
              <FormFragment
                v-if="validate.loggingEnabled === 'enabled'"
                title="Backend name"
                for-attr="backend-name"
              >
                <input
                  id="backend-name"
                  v-model="validate.meshLoggingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-backend-name"
                >
              </FormFragment>
              <div v-if="validate.loggingEnabled === 'enabled'">
                <FormFragment title="Type">
                  <select
                    id="logging-type"
                    ref="loggingTypeSelect"
                    v-model="validate.loggingType"
                    class="k-input w-100"
                    name="logging-type"
                  >
                    <option value="tcp">
                      TCP
                    </option>
                    <option value="file">
                      File
                    </option>
                  </select>
                </FormFragment>
                <!-- if the format type is File -->
                <FormFragment
                  v-if="validate.loggingType === 'file'"
                  title="Path"
                  for-attr="backend-address"
                >
                  <input
                    id="backend-address"
                    v-model="validate.meshLoggingPath"
                    type="text"
                    class="k-input w-100"
                  >
                </FormFragment>
                <!-- if the format type is TCP -->
                <FormFragment
                  v-if="validate.loggingType === 'tcp'"
                  title="Address"
                  for-attr="backend-address"
                >
                  <input
                    id="backend-address"
                    v-model="validate.meshLoggingAddress"
                    type="text"
                    class="k-input w-100"
                  >
                </FormFragment>
                <FormFragment
                  title="Format"
                  for-attr="backend-format"
                >
                  <textarea
                    id="backend-format"
                    v-model="validate.meshLoggingBackendFormat"
                    class="k-input w-100 code-sample"
                    rows="12"
                  />
                </FormFragment>
              </div>
            </template>
          </KCard>
        </template>
        <template #tracing>
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
            <template #body>
              <FormFragment title="Tracing">
                <label class="k-input-label mx-2">
                  <input
                    id="tracing-disabled"
                    v-model="validate.tracingEnabled"
                    value="disabled"
                    name="tracing"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="tracing-enabled"
                    v-model="validate.tracingEnabled"
                    value="enabled"
                    name="tracing"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                title="Backend name"
                for-attr="tracing-backend-name"
              >
                <input
                  id="tracing-backend-name"
                  v-model="validate.meshTracingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-tracing-backend-name"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                title="Type"
                for-attr="tracing-type"
              >
                <select
                  id="tracing-type"
                  v-model="validate.meshTracingType"
                  class="k-input w-100"
                  name="tracing-type"
                >
                  <option value="zipkin">
                    Zipkin
                  </option>
                </select>
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                title="Sampling"
                for-attr="tracing-sampling"
              >
                <input
                  id="tracing-sampling"
                  v-model="validate.meshTracingSampling"
                  type="number"
                  class="k-input w-100"
                  step="0.1"
                  min="0"
                  max="100"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                title="URL"
                for-attr="tracing-zipkin-url"
              >
                <input
                  id="tracing-zipkin-url"
                  v-model="validate.meshTracingZipkinURL"
                  type="text"
                  class="k-input w-100"
                  placeholder="http://zipkin.url:1234"
                >
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template #metrics>
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
            <template #body>
              <FormFragment title="Metrics">
                <label class="k-input-label mx-2">
                  <input
                    id="metrics-disabled"
                    v-model="validate.metricsEnabled"
                    value="disabled"
                    name="metrics"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Disabled</span>
                </label>
                <label class="k-input-label mx-2">
                  <input
                    id="metrics-enabled"
                    v-model="validate.metricsEnabled"
                    value="enabled"
                    name="metrics"
                    type="radio"
                    class="k-input mr-2"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>
              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                title="Backend name"
                for-attr="metrics-name"
              >
                <input
                  id="metrics-name"
                  v-model="validate.meshMetricsName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-metrics-backend-name"
                >
              </FormFragment>
              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                title="Type"
                for-attr="metrics-type"
              >
                <select
                  id="metrics-type"
                  v-model="validate.meshMetricsType"
                  class="k-input w-100"
                  name="metrics-type"
                >
                  <option value="prometheus">
                    Prometheus
                  </option>
                </select>
              </FormFragment>
              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                title="Dataplane port"
                for-attr="metrics-dataplane-port"
              >
                <input
                  id="metrics-dataplane-port"
                  v-model="validate.meshMetricsDataplanePort"
                  type="number"
                  class="k-input w-100"
                  step="1"
                  min="0"
                  max="65535"
                  placeholder="1234"
                >
              </FormFragment>
              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                title="Dataplane path"
                for-attr="metrics-dataplane-path"
              >
                <input
                  id="metrics-dataplane-path"
                  v-model="validate.meshMetricsDataplanePath"
                  type="text"
                  class="k-input w-100"
                >
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template #complete>
          <div v-if="codeOutput">
            <div v-if="hideScannerSiblings === false">
              <h3>
                Install a new Mesh
              </h3>
              <p>
                Since the {{ productName }} GUI is read-only mode to follow Ops best practices,
                please execute the following command in your shell to create the entity.
                {{ productName }} will automatically detect when the new entity has been created.
              </p>
              <TabsWidget
                :loaders="false"
                :tabs="tabs"
                :initial-tab-override="environment"
                @onTabChange="onTabChange"
              >
                <template #kubernetes>
                  <CodeView
                    title="Kubernetes"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template>
                <template #universal>
                  <CodeView
                    title="Universal"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template>
              </TabsWidget>
            </div>
            <EntityScanner
              :loader-function="scanForEntity"
              :should-start="true"
              :has-error="scanError"
              :can-complete="scanFound"
              @hideSiblings="hideSiblings"
            >
              <!-- loading -->
              <template #loading-title>
                <h3>Searching&hellip;</h3>
              </template>
              <template #loading-content>
                <p>We are looking for your mesh.</p>
              </template>
              <!-- complete -->
              <template #complete-title>
                <h3>Done!</h3>
              </template>
              <template #complete-content>
                <p>
                  Your Mesh <strong v-if="validate.meshName">{{ validate.meshName }}</strong> was found!
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
              <template #error-title>
                <h3>Mesh not found</h3>
              </template>
              <template #error-content>
                <p>We were unable to find your mesh.</p>
              </template>
            </EntityScanner>
          </div>
          <KAlert
            v-else
            appearance="danger"
          >
            <template #alertMessage>
              <p>
                You haven't filled any data out yet! Please return to the first
                step and fill out your information.
              </p>
            </template>
          </KAlert>
        </template>

        <!-- sidebar content -->
        <template #mesh>
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
              :href="`https://kuma.io/docs/${kumaDocsVersion}/policies/mesh/${utm}`"
              target="_blank"
            >
              Learn More
            </a>
          </p>
        </template>
        <template #did-you-know>
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
import Kuma from '@/services/kuma'
import { rejectKeys } from '@/views/Wizard/helpers'
import { kebabCase } from '@/helpers'
import FormatForCLI from '@/mixins/FormatForCLI'
import FormFragment from '@/views/Wizard/components/FormFragment.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton.vue'
import CodeView from '@/components/Skeletons/CodeView.vue'
import EntityScanner from '@/views/Wizard/components/EntityScanner.vue'

// schema for building code output
import meshSchema from '@/views/Wizard/schemas/Mesh'
import { PRODUCT_NAME } from '@/consts'

export default {
  name: 'MeshWizard',
  metaInfo: {
    title: 'Create a new Mesh',
  },
  components: {
    FormFragment,
    TabsWidget,
    StepSkeleton,
    CodeView,
    EntityScanner,
  },
  mixins: [FormatForCLI],
  data() {
    return {
      productName: PRODUCT_NAME,
      selectedTab: '',
      schema: meshSchema,
      steps: [
        {
          label: 'General & Security',
          slug: 'general',
        },
        {
          label: 'Logging',
          slug: 'logging',
        },
        {
          label: 'Tracing',
          slug: 'tracing',
        },
        {
          label: 'Metrics',
          slug: 'metrics',
        },
        {
          label: 'Install',
          slug: 'complete',
        },
      ],
      tabs: [
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
        {
          hash: '#universal',
          title: 'Universal',
        },
      ],
      sidebarContent: [
        {
          name: 'mesh',
        },
        {
          name: 'did-you-know',
        },
      ],
      formConditions: {
        mtlsEnabled: false,
        loggingEnabled: false,
        tracingEnabled: false,
        metricsEnabled: false,
        loggingType: null,
      },
      startScanner: false,
      scanFound: false,
      hideScannerSiblings: false,
      scanError: false,
      isComplete: false,
      validate: {
        meshName: '',
        meshCAName: '',
        meshLoggingBackend: '',
        meshTracingBackend: '',
        meshMetricsName: '',
        meshTracingZipkinURL: '',
        mtlsEnabled: 'disabled',
        meshCA: 'builtin',
        loggingEnabled: 'disabled',
        loggingType: 'tcp',
        meshLoggingPath: '/',
        meshLoggingAddress: '127.0.0.1:5000',
        meshLoggingBackendFormat:
          "{ start_time: '%START_TIME%', source: '%KUMA_SOURCE_SERVICE%', destination: '%KUMA_DESTINATION_SERVICE%', source_address: '%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%', destination_address: '%UPSTREAM_HOST%', duration_millis: '%DURATION%', bytes_received: '%BYTES_RECEIVED%', bytes_sent: '%BYTES_SENT%' }",
        tracingEnabled: 'disabled',
        meshTracingType: 'zipkin',
        meshTracingSampling: 99.9,
        metricsEnabled: 'disabled',
        meshMetricsType: 'prometheus',
        meshMetricsDataplanePort: 5670,
        meshMetricsDataplanePath: '/metrics',
      },
      vmsg: [],
      utm: process.env.VUE_APP_UTM,
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      kumaDocsVersion: 'config/getKumaDocsVersion',
      environment: 'config/getEnvironment',
    }),

    // Our generated code output
    codeOutput() {
      const schema = this.schema
      const schemaNew = Object.assign({}, schema)
      const newData = this.validate

      // if there is no data set yet, do nothing
      if (!newData) return

      /**
       * Assign new values to our schema
       */

      // conditionals
      const hasMtls = newData.mtlsEnabled === 'enabled'
      const hasLogging = newData.loggingEnabled === 'enabled'
      const hasTracing = newData.tracingEnabled === 'enabled'
      const hasMetrics = newData.metricsEnabled === 'enabled'

      // filter options
      const featureStatus = {
        mtls: hasMtls,
        logging: hasLogging,
        tracing: hasTracing,
        metrics: hasMetrics,
      }

      // define the features we are going to omit from our object
      const filteredFeatures = []

      Object.entries(featureStatus).forEach((r) => {
        const condition = r[1]
        const value = r[0]

        if (condition) {
          filteredFeatures.filter((i) => i !== value)
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
        const certAuth = this.validate.meshCA
        const certName = this.validate.meshCAName

        mtlsObject.backends = []

        mtlsObject.enabledBackend = certName

        if (certAuth === 'provided') {
          mtlsObject.backends = [
            {
              name: certName,
              type: certAuth,
              conf: {
                cert: {
                  secret: '',
                },
                key: {
                  secret: '',
                },
              },
            },
          ]
        } else {
          mtlsObject.backends = [
            {
              name: certName,
              type: certAuth,
            },
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
        loggingObj.type = newData.loggingType
        loggingObj.format = newData.meshLoggingBackendFormat || fallbackFormat

        if (newData.loggingType === 'tcp') {
          loggingObj.conf.address = newData.meshLoggingAddress || '127.0.0.1:5000'
        } else if (newData.loggingType === 'file') {
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
            name: newData.meshName,
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

      return this.formatForCLI(meshYaml, '" | kumactl apply -f -')
    },
    nextDisabled() {
      const {
        meshName,
        meshCAName,
        meshLoggingBackend,
        meshTracingBackend,
        meshTracingZipkinURL,
        meshMetricsName,
        mtlsEnabled,
        loggingEnabled,
        tracingEnabled,
        metricsEnabled,
        meshLoggingPath,
        loggingType,
      } = this.validate

      if (!meshName.length || (mtlsEnabled === 'enabled' && !meshCAName)) {
        return true
      }

      if (this.$route.query.step === '1') {
        if (loggingEnabled === 'disabled') {
          return false
        }

        if (!meshLoggingBackend) {
          return true
        }

        return loggingType === 'file' && !meshLoggingPath
      }

      if (this.$route.query.step === '2') {
        return tracingEnabled === 'enabled' && !(meshTracingBackend && meshTracingZipkinURL)
      }

      if (this.$route.query.step === '3') {
        return metricsEnabled === 'enabled' && !meshMetricsName
      }

      return false
    },
  },
  watch: {
    // mesh name
    'validate.meshName'(value) {
      const newName = kebabCase(value)

      this.validate.meshName = newName
      this.validateMeshName(newName)
    },
    // mesh cert name
    'validate.meshCAName'(value) {
      this.validate.meshCAName = kebabCase(value)
    },
    // mesh logging backend name
    'validate.meshLoggingBackend'(value) {
      this.validate.meshLoggingBackend = kebabCase(value)
    },
    // mesh tracing backend name
    'validate.meshTracingBackend'(value) {
      this.validate.meshTracingBackend = kebabCase(value)
    },
    'validate.meshMetricsName'(value) {
      this.validate.meshMetricsName = kebabCase(value)
    },
  },
  methods: {
    onTabChange(newTab) {
      this.selectedTab = newTab
    },
    hideSiblings() {
      // this triggers when to hide the siblings related to the Scanner
      // component that need to be hidden once the scan succeeds.
      this.hideScannerSiblings = true
    },
    validateMeshName(value) {
      if (!value || value === '') {
        this.vmsg.meshName = 'A Mesh name is required to proceed'
      } else {
        this.vmsg.meshName = ''
      }
    },
    scanForEntity() {
      const entity = this.validate.meshName

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there's nothing found
      if (!entity) return

      Kuma.getMesh({ name: entity })
        .then((response) => {
          if (response && response.name.length > 0) {
            this.isRunning = true
            this.scanFound = true
          } else {
            this.scanError = true
          }
        })
        .catch((error) => {
          this.scanError = true

          console.error(error)
        })
        .finally(() => {
          this.scanComplete = true
        })
    },
  },
}
</script>
