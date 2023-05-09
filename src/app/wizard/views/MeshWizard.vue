<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="STEPS"
        :sidebar-content="SIDEBAR_CONTENT"
        :footer-enabled="hideScannerSiblings === false"
        :next-disabled="nextDisabled"
        @go-to-step="updateStoredData"
      >
        <!-- step content -->
        <template #general>
          <p>
            Welcome to the wizard for creating a new Mesh resource in {{ env('KUMA_PRODUCT_NAME') }}.
            We will be providing you with a few steps that will get you started.
          </p>

          <p>
            As you know, the {{ env('KUMA_PRODUCT_NAME') }} GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <code>kubectl</code> (if you are running in Kubernetes mode) or
            <code>kumactl</code> / API (if you are running in Universal mode).
          </p>

          <h3>
            To get started, please fill in the following information:
          </h3>

          <KCard
            class="my-6"
            title="Mesh Information"
            has-shadow
          >
            <template #body>
              <KAlert
                v-if="hasStoredMeshData"
                class="reset-mesh-data-alert"
                appearance="info"
              >
                <template #alertMessage>
                  Want to start with an empty slate?
                </template>

                <template #actionButtons>
                  <KButton
                    apperance="outline"
                    @click="resetMeshData"
                  >
                    Reset to defaults
                  </KButton>
                </template>
              </KAlert>

              <FormFragment
                class="mt-4"
                title="Mesh name"
                for-attr="mesh-name"
              >
                <input
                  id="mesh-name"
                  v-model="validate.meshName"
                  type="text"
                  class="k-input w-100"
                  data-testid="mesh-name"
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

              <FormFragment
                class="mt-4"
                title="Mutual TLS"
              >
                <label class="k-input-label mx-2">
                  <input
                    ref="mtlsDisabled"
                    v-model="validate.mtlsEnabled"
                    value="disabled"
                    name="mtls"
                    type="radio"
                    class="k-input mr-2"
                    data-testid="mesh-mtls-disabled"
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
                    data-testid="mesh-mtls-enabled"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.mtlsEnabled === 'enabled'"
                class="mt-4"
                title="Certificate name"
                for-attr="certificate-name"
              >
                <input
                  id="certificate-name"
                  v-model="validate.meshCAName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-certificate-name"
                  data-testid="mesh-certificate-name"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.mtlsEnabled === 'enabled'"
                class="mt-4"
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
            You can setup as many logging backends as you need that you can later use to log traffic via the “TrafficLog” policy. In this wizard, we allow you to configure one backend, but you can add more manually if you wish.
          </p>

          <KCard
            class="my-6"
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
                    data-testid="mesh-logging-disabled"
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
                    data-testid="mesh-logging-enabled"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.loggingEnabled === 'enabled'"
                class="mt-4"
                title="Backend name"
                for-attr="backend-name"
              >
                <input
                  id="backend-name"
                  v-model="validate.meshLoggingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-backend-name"
                  data-testid="mesh-logging-backend-name"
                >
              </FormFragment>

              <div v-if="validate.loggingEnabled === 'enabled'">
                <FormFragment
                  class="mt-4"
                  title="Type"
                >
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
                  class="mt-4"
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
                  class="mt-4"
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
                  class="mt-4"
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
            You can setup as many tracing backends as you need that you can later use to log traffic via the “TrafficTrace” policy. In this wizard we allow you to configure one backend, but you can add more manually as you wish.
          </p>

          <KCard
            class="my-6"
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
                    data-testid="mesh-tracing-enabled"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                class="mt-4"
                title="Backend name"
                for-attr="tracing-backend-name"
              >
                <input
                  id="tracing-backend-name"
                  v-model="validate.meshTracingBackend"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-tracing-backend-name"
                  data-testid="mesh-tracing-backend-name"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.tracingEnabled === 'enabled'"
                class="mt-4"
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
                class="mt-4"
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
                class="mt-4"
                title="URL"
                for-attr="tracing-zipkin-url"
              >
                <input
                  id="tracing-zipkin-url"
                  v-model="validate.meshTracingZipkinURL"
                  type="text"
                  class="k-input w-100"
                  placeholder="http://zipkin.url:1234"
                  data-testid="mesh-tracing-url"
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
            class="my-6"
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
                    data-testid="mesh-metrics-enabled"
                  >
                  <span>Enabled</span>
                </label>
              </FormFragment>

              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                class="mt-4"
                title="Backend name"
                for-attr="metrics-name"
              >
                <input
                  id="metrics-name"
                  v-model="validate.meshMetricsName"
                  type="text"
                  class="k-input w-100"
                  placeholder="your-metrics-backend-name"
                  data-testid="mesh-metrics-backend-name"
                >
              </FormFragment>

              <FormFragment
                v-if="validate.metricsEnabled === 'enabled'"
                class="mt-4"
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
                class="mt-4"
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
                class="mt-4"
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
                Since the {{ env('KUMA_PRODUCT_NAME') }} GUI is read-only mode to follow Ops best practices,
                please execute the following command in your shell to create the entity.
                {{ env('KUMA_PRODUCT_NAME') }} will automatically detect when the new entity has been created.
              </p>

              <TabsWidget
                :tabs="TABS"
                :initial-tab-override="environment"
                @on-tab-change="onTabChange"
              >
                <template #kubernetes>
                  <CodeBlock
                    id="code-block-kubernetes-command"
                    data-testid="kubernetes"
                    language="bash"
                    :code="codeOutput"
                  />
                </template>

                <template #universal>
                  <CodeBlock
                    id="code-block-universal-command"
                    data-testid="universal"
                    language="bash"
                    :code="codeOutput"
                  />
                </template>
              </TabsWidget>
            </div>

            <EntityScanner
              :loader-function="scanForEntity"
              :has-error="scanError"
              :can-complete="scanFound"
              @hide-siblings="hideSiblings"
            >
              <!-- loading -->
              <template #loading-title>
                <h3>Searching…</h3>
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
                  Your mesh <strong v-if="validate.meshName">{{ validate.meshName }}</strong> was found!
                </p>

                <p>
                  <KButton
                    appearance="primary"
                    :to="{ name: 'mesh-detail-view', params: { mesh: validate.meshName } }"
                  >
                    Go to mesh {{ validate.meshName }}
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
            In {{ env('KUMA_PRODUCT_NAME') }}, a Mesh resource allows you to define an isolated environment
            for your data-planes and policies. It's isolated because the mTLS CA
            you choose can be different from the one configured for our Meshes.
            Ideally, you will have either a large Mesh with all the workloads, or
            one Mesh per application for better isolation.
          </p>

          <p>
            <a
              :href="`${env('KUMA_DOCS_URL')}/policies/mesh/?${env('KUMA_UTM_QUERY_PARAMS')}`"
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

<script lang="ts" setup>
import { KAlert, KButton, KCard } from '@kong/kongponents'
import { computed, ref, watch } from 'vue'

import meshSchema from './MeshSchema'
import EntityScanner from '../components/EntityScanner.vue'
import FormFragment from '../components/FormFragment.vue'
import StepSkeleton from '../components/StepSkeleton.vue'
import { formatForCLI } from '../formatForCLI'
import CodeBlock from '@/app/common/CodeBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import { useStore } from '@/store/store'
import { useEnv, useKumaApi } from '@/utilities'
import { ClientStorage } from '@/utilities/ClientStorage'
import { kebabCase } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()

const STEPS = [
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
]

const SIDEBAR_CONTENT = [
  {
    name: 'mesh',
  },
  {
    name: 'did-you-know',
  },
]

const TABS = [
  {
    hash: '#kubernetes',
    title: 'Kubernetes',
  },
  {
    hash: '#universal',
    title: 'Universal',
  },
]

const env = useEnv()

function getInitialMeshData() {
  return {
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
    meshLoggingBackendFormat: '{ start_time: "%START_TIME%", source: "%KUMA_SOURCE_SERVICE%", destination: "%KUMA_DESTINATION_SERVICE%", source_address: "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", destination_address: "%UPSTREAM_HOST%", duration_millis: "%DURATION%", bytes_received: "%BYTES_RECEIVED%", bytes_sent: "%BYTES_SENT%" }',
    tracingEnabled: 'disabled',
    meshTracingType: 'zipkin',
    meshTracingSampling: 99.9,
    metricsEnabled: 'disabled',
    meshMetricsType: 'prometheus',
    meshMetricsDataplanePort: 5670,
    meshMetricsDataplanePath: '/metrics',
  }
}

function rejectKeys(obj: any, keys: any[]) {
  return Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => Object.assign({}, { [k]: obj[k] }))
    .reduce((res, o) => Object.assign(res, o), {})
}
const store = useStore()

const hasStoredMeshData = ref(false)
const selectedTab = ref('')
const schema = ref(meshSchema)
const step = ref(0)
const scanFound = ref(false)
const hideScannerSiblings = ref(false)
const scanError = ref(false)
const isComplete = ref(false)
const validate = ref(getInitialMeshData())
const vmsg = ref({ meshName: '' })

const environment = computed(() => store.getters['config/getEnvironment'])

// Our generated code output
const codeOutput = computed(() => {
  const schemaNew: any = Object.assign({}, schema.value)
  const newData = validate.value

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
  const filteredFeatures: any[] = []

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
    const mtlsObject = schemaNew.mtls
    const certAuth = validate.value.meshCA
    const certName = validate.value.meshCAName

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

    tracingObj.defaultBackend = newData.meshTracingBackend
    tracingObj.backends[0].type = newData.meshTracingType || 'zipkin'
    tracingObj.backends[0].name = newData.meshTracingBackend
    tracingObj.backends[0].sampling = newData.meshTracingSampling || 100

    tracingObj.backends[0].conf = {}
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
  let meshYaml: any

  let ctl

  if (selectedTab.value === '#kubernetes') {
    // Kubernetes
    ctl = 'kubectl'
    meshYaml = {
      apiVersion: 'kuma.io/v1alpha1',
      kind: 'Mesh',
      metadata: {
        name: newData.meshName,
      },
    }

    if (Object.keys(schemaClean).length > 0) {
      meshYaml.spec = schemaClean
    }
  } else {
    // Universal
    ctl = 'kumactl'
    meshYaml = {
      type: 'Mesh',
      name: newData.meshName,
      ...schemaClean,
    }
  }

  return formatForCLI(meshYaml, `" | ${ctl} apply -f -`)
})

const nextDisabled = computed(() => {
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
  } = validate.value

  if (meshName.length === 0 || (mtlsEnabled === 'enabled' && !meshCAName)) {
    return true
  }

  if (step.value === 1) {
    if (loggingEnabled === 'disabled') {
      return false
    }

    if (!meshLoggingBackend) {
      return true
    }

    return loggingType === 'file' && !meshLoggingPath
  }

  if (step.value === 2) {
    return tracingEnabled === 'enabled' && !(meshTracingBackend && meshTracingZipkinURL)
  }

  if (step.value === 3) {
    return metricsEnabled === 'enabled' && !meshMetricsName
  }

  return false
})

// mesh name
watch(() => validate.value.meshName, function (value) {
  const newName = kebabCase(value)

  validate.value.meshName = newName
  validateMeshName(newName)
})

// mesh cert name
watch(() => validate.value.meshCAName, function (value) {
  validate.value.meshCAName = kebabCase(value)
})

// mesh logging backend name
watch(() => validate.value.meshLoggingBackend, function (value) {
  validate.value.meshLoggingBackend = kebabCase(value)
})

// mesh tracing backend name
watch(() => validate.value.meshTracingBackend, function (value) {
  validate.value.meshTracingBackend = kebabCase(value)
})

watch(() => validate.value.meshMetricsName, function (value) {
  validate.value.meshMetricsName = kebabCase(value)
})

const stepParameter = QueryParameter.get('step')
step.value = stepParameter !== null ? parseInt(stepParameter) : 0

const storedMesh = ClientStorage.get('createMeshData')
if (storedMesh !== null) {
  validate.value = storedMesh
  hasStoredMeshData.value = true
}

function updateStoredData(newStep: number): void {
  step.value = newStep
  ClientStorage.set('createMeshData', validate.value)
  hasStoredMeshData.value = true
}

function resetMeshData(): void {
  ClientStorage.remove('createMeshData')
  hasStoredMeshData.value = false
  validate.value = getInitialMeshData()
}

function onTabChange(newTab: string): void {
  selectedTab.value = newTab
}

function hideSiblings(): void {
  // this triggers when to hide the siblings related to the Scanner
  // component that need to be hidden once the scan succeeds.
  hideScannerSiblings.value = true
}

function validateMeshName(value: string): void {
  if (!value || value === '') {
    vmsg.value.meshName = 'A Mesh name is required to proceed'
  } else {
    vmsg.value.meshName = ''
  }
}

async function scanForEntity() {
  const entity = validate.value.meshName

  // reset things if the user is starting over
  isComplete.value = false
  scanError.value = false

  // do nothing if there's nothing found
  if (!entity) return

  try {
    const mesh = await kumaApi.getMesh({ name: entity })

    if (mesh.name.length > 0) {
      scanFound.value = true
    } else {
      scanError.value = true
    }
  } catch (err) {
    scanError.value = true

    console.error(err)
  } finally {
    isComplete.value = true
  }
}
</script>

<style lang="scss" scoped>
.code-sample {
  font-family: var(--font-family-mono);
}
</style>
