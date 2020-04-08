<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="steps"
        :advance-check="true"
        :sidebar-content="sidebarContent"
      >
        <!-- step content -->
        <template slot="general">
          <p>
            Welcome to the wizard for creating a new Mesh entity in Kuma.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the Kuma GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <code>kubectl</code> (if you are running in Kubernetes mode) or
            kumactl / API (if you are running in Universal mode).
          </p>

          <h3>
            To get started, please fill-in the following information:
          </h3>

          <KCard
            class="my-6 k-card--small"
            title="Mesh Information"
            has-shadow
          >
            <template slot="body">
              <form id="entity-name-selection">
                <FormFragment
                  title="Mesh name"
                  for-attr="mesh-name"
                >
                  <input
                    id="mesh-name"
                    v-serialize-input
                    type="text"
                    class="k-input w-100"
                    placeholder="your-mesh-name"
                    :value="getStorageItem('meshName')"
                    @change="updateStorage('meshName', $event.target.value)"
                  >
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
                      @change="updateStorage('meshMtls', 'disabled'); formConditions.mtlsEnabled = false"
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
                      @change="updateStorage('meshMtls', 'enabled'); formConditions.mtlsEnabled = true"
                    >
                    <span>Enabled</span>
                  </label>
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
                      selected
                      disabled
                    >
                      Select a CA&hellip;
                    </option>
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
              </form>
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
              <form>
                <FormFragment title="Logging">
                  <label class="k-input-label mx-2">
                    <input
                      id="logging-disabled"
                      value="disabled"
                      name="logging"
                      type="radio"
                      class="k-input mr-2"
                      :checked="formConditions.loggingEnabled === false"
                      @change="updateStorage('meshLoggingStatus', 'disabled'); formConditions.loggingEnabled = false"
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
                      @change="updateStorage('meshLoggingStatus', 'enabled'); formConditions.loggingEnabled = true"
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
                    v-serialize-input
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
                        selected
                        disabled
                      >
                        Select a Logging Type&hellip;
                      </option>
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
                      placeholder="127.0.0.1"
                      :value="getStorageItem('meshLoggingAddress')"
                      @change="updateStorage('meshLoggingAddress', $event.target.value)"
                    >
                  </FormFragment>
                  <!-- if the format type is File -->
                  <FormFragment
                    v-else
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
              </form>
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
              <form>
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
                      @change="updateStorage('meshTracingStatus', 'disabled'); formConditions.tracingEnabled = false"
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
                      @change="updateStorage('meshTracingStatus', 'enabled'); formConditions.tracingEnabled = true"
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
                    v-serialize-input
                    type="text"
                    class="k-input w-100"
                    placeholder="your-tracing-backend-name"
                    :value="getStorageItem('meshTracingBackend')"
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
                      selected
                      disabled
                    >
                      Select a Tracing type&hellip;
                    </option>
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
                    :value="getStorageItem('meshTracingZipkinURL')"
                    @change="updateStorage('meshTracingZipkinURL', $event.target.value)"
                  >
                </FormFragment>
              </form>
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
              <form>
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
                      @change="updateStorage('meshMetricsStatus', 'disabled'); formConditions.metricsEnabled = false"
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
                      @change="updateStorage('meshMetricsStatus', 'enabled'); formConditions.metricsEnabled = true"
                    >
                    <span>Enabled</span>
                  </label>
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
                      selected
                      disabled
                    >
                      Select a Metrics type&hellip;
                    </option>
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
                    :value="getStorageItem('meshMetricsDataplanePort')"
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
                    placeholder="/metrics"
                    :value="getStorageItem('meshMetricsDataplanePath')"
                    @change="updateStorage('meshMetricsDataplanePath', $event.target.value)"
                  >
                </FormFragment>
              </form>
            </template>
          </KCard>
        </template>
        <template slot="complete">
          <h3>
            Create a new Mesh
          </h3>
          <p>
            You can now execute the following commands to create the mesh.
          </p>
          <Tabs
            :loaders="false"
            :tabs="tabs"
            :has-border="true"
            tab-state="environment"
          >
            <template slot="universal">
              {{ codeOutput }}
            </template>
            <template slot="kubernetes">
              <YamlView
                title="Kubernetes"
                :content="codeOutput"
              />
            </template>
          </Tabs>
        </template>

        <!-- sidebar content -->
        <template slot="mesh">
          <h3>Mesh</h3>
          <p>
            In {{ title }}, a Mesh entity allows you to define an isolated environment
            for your data-planes and policies. It's isolated because the mTLS CA
            you choose can be different from the one configured for our Meshes.
            Ideally, you will have either a large Mesh with all the workloads, or
            one Mesh per application for better isolation.
          </p>
          <p>
            <a
              :href="`https://kuma.io/docs/${version}/policies/mesh/`"
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
import updateStorage from '@/views/Wizard/mixins/updateStorage'
import SerializeInput from '@/views/Wizard/directives/SerializeInput'
import FormFragment from '@/views/Wizard/components/FormFragment'
import Tabs from '@/components/Utils/Tabs'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton'
import YamlView from '@/components/Skeletons/YamlView'

// schema for building code output
import meshSchema from '@/views/Wizard/schemas/Mesh'

export default {
  metaInfo: {
    title: 'Create a new Mesh'
  },
  components: {
    FormFragment,
    Tabs,
    StepSkeleton,
    YamlView
  },
  directives: {
    SerializeInput
  },
  mixins: [
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
          hash: '#universal',
          title: 'Universal'
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes'
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
        loggingType: 'tcp'
      }
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

    // Our generated code output
    codeOutput () {
      const schema = this.schema
      const newData = this.formData

      // if there is no data set yet, do nothing
      if (!newData) return

      const type = (this.selectedTab === '#universal') ? 'type' : 'kind'

      /**
       * Assign new values to our schema
       */

      // set a name
      schema.metadata.name = newData.meshName

      // mTLS
      if (newData.meshMtls === 'enabled') {
        schema.spec.mtls.ca = {
          [newData.meshCA || 'builtin']: {}
        }
      }

      // Logging
      if (newData.meshLoggingStatus === 'enabled') {
        const loggingObj = schema.spec.logging.backends[0]
        const fallbackFormat = loggingObj.format

        loggingObj.name = newData.meshLoggingBackend
        loggingObj.format = newData.meshLoggingBackendFormat || fallbackFormat

        if (newData.meshLoggingType === 'tcp') {
          loggingObj.tcp.address = newData.meshLoggingAddress
        } else {
          // TODO condition for when `file` is picked
        }
      }

      // Tracing
      if (newData.meshTracingStatus === 'enabled') {
        const tracingObj = schema.spec.tracing

        tracingObj.defaultBackend = newData.meshTracingBackend
        tracingObj.backends[0].name = newData.meshTracingBackend
        tracingObj.backends[0].sampling = newData.meshTracingSampling || 100
        tracingObj.backends[0].zipkin.url = newData.meshTracingZipkinURL
      }

      // Metrics
      if (newData.meshMetricsStatus === 'enabled') {
        const metricsObj = schema.spec.metrics

        // Prometheus is currently the only metrics option offered
        // but this will change in the future
        metricsObj.prometheus.port = newData.meshMetricsDataplanePort
        metricsObj.prometheus.path = newData.meshMetricsDataplanePath
      }

      return schema
    }
  }
}
</script>
