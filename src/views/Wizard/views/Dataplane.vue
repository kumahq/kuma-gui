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
            class="my-6 empty-state--wide-content empty-state--compact"
          >
            <template
              v-if="environment === 'kubernetes' || environment === 'universal'"
              slot="title"
            >
              Running on {{ environment }}
            </template>
            <template slot="message">
              <p v-if="environment === 'kubernetes'">
                We have detected that you are running on a <strong>Kubernetes environment</strong>,
                and we are going to be showing you instructions for Kubernetes unless you
                decide to visualize the instructions for Universal.
              </p>
              <p v-else-if="environment === 'universal'">
                We have detected that you are running on a <strong>Universal environment</strong>,
                and we are going to be showing you instructions for Universal, unless you
                decide to visualize the instructions for Kubernetes.
              </p>
              <p v-else>
                We were unable to determine your environment.
              </p>
            </template>
            <template slot="cta">
              <KButton
                v-if="environment"
                :to="instructionsCtaRoute"
                appearance="primary"
              >
                <!--
                  this should send the user to an entirely separate wizard for
                  the platform opposite of the one the user is on
                -->
                {{ instructionsCtaText }}
              </KButton>
            </template>
          </KEmptyState>

          <h3>
            To get started, please select on what Mesh you would like to add the Dataplane:
          </h3>

          <p>
            If you've got an existing Mesh that you would like to associate with your
            Dataplane, you can select it below, or create a new one using our
            <router-link :to="{ path: '/wizard/mesh' }">
              Mesh Wizard
            </router-link>.
          </p>

          <!-- mesh selection -->
          <KCard
            class="my-6"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                title="Choose a Mesh"
                for-attr="dp-mesh"
                all-inline
              >
                <div>
                  <select
                    id="dp-mesh"
                    v-model="validate.meshName"
                    class="k-input w-100"
                    @change="updateStorage('dpMesh', $event.target.value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select an existing Mesh&hellip;
                    </option>
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
                  <label class="k-input-label mr-4">
                    or
                  </label>
                  <KButton
                    :to="{ name: 'create-mesh' }"
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
            </template>
          </KCard>
        </template>
        <template slot="scope-settings">
          <h3>
            Setup Dataplane Mode
          </h3>
          <p>
            You can create a data plane for a service or a data plane for an Ingress gateway.
          </p>

          <!-- dataplane mode -->
          <KCard
            class="my-6"
            has-shadow
          >
            <template slot="body">
              <FormFragment
                all-inline
                equal-cols
                hide-label-col
              >
                <label for="service-dataplane">
                  <input
                    id="service-dataplane"
                    v-model="validate.k8sDataplaneType"
                    class="k-input"
                    type="radio"
                    name="dataplane-type"
                    value="dataplane-type-service"
                    checked
                  >
                  <span>
                    Service Dataplane
                  </span>
                </label>
                <label for="ingress-dataplane">
                  <input
                    id="ingress-dataplane"
                    v-model="validate.k8sDataplaneType"
                    class="k-input"
                    type="radio"
                    name="dataplane-type"
                    value="dataplane-type-ingress"
                  >
                  <span>
                    Ingress Dataplane
                  </span>
                </label>
              </FormFragment>
            </template>
          </KCard>

          <div v-if="validate.k8sDataplaneType === 'dataplane-type-service'">
            <p>
              Should the data plane be added for an entire Namespace and all of its services,
              or for specific individual services in any namespace?
            </p>

            <!-- service selection -->
            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  all-inline
                  equal-cols
                  hide-label-col
                >
                  <label for="k8s-services-all">
                    <input
                      id="k8s-services-all"
                      v-model="validate.k8sServices"
                      class="k-input"
                      type="radio"
                      name="k8s-services"
                      value="all-services"
                      checked
                    >
                    <span>
                      All Services in Namespace
                    </span>
                  </label>
                  <label for="k8s-services-individual">
                    <input
                      id="k8s-services-individual"
                      v-model="validate.k8sServices"
                      class="k-input"
                      type="radio"
                      name="k8s-services"
                      value="individual-services"
                    >
                    <span>
                      Individual Services
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <KCard
              v-if="validate.k8sServices === 'individual-services'"
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  all-inline
                  equal-cols
                  hide-label-col
                >
                  <label for="k8s-deployment-existing">
                    <input
                      id="k8s-deployment-existing"
                      v-model="validate.k8sDeployment"
                      class="k-input"
                      type="radio"
                      name="k8s-deployment"
                      value="existing-deployment"
                      checked
                    >
                    <span>
                      Existing Deployment
                    </span>
                  </label>
                  <label for="k8s-deployment-new">
                    <input
                      id="k8s-deployment-new"
                      v-model="validate.k8sDeployment"
                      class="k-input"
                      type="radio"
                      name="k8s-deployment"
                      value="new-deployment"
                    >
                    <span>
                      New Deployment
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <!-- namespace selection options -->
            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  all-inline
                  equal-cols
                  hide-label-col
                >
                  <label for="k8s-namespace-existing">
                    <input
                      id="k8s-namespace-existing"
                      v-model="validate.k8sNamespace"
                      class="k-input"
                      type="radio"
                      name="k8s-namespace"
                      value="existing-namespace"
                      checked
                    >
                    <span>
                      Existing Namespace
                    </span>
                  </label>
                  <label for="k8s-namespace-new">
                    <input
                      id="k8s-namespace-new"
                      v-model="validate.k8sNamespace"
                      class="k-input"
                      type="radio"
                      name="k8s-namespace"
                      value="new-namespace"
                    >
                    <span>
                      New Namespace
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <!-- namespace selection -->
            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  title="Namespace"
                  for-attr="k8s-namespace-selection"
                >
                  <select
                    v-if="validate.k8sNamespace === 'existing-namespace'"
                    id="k8s-namespace-selection"
                    v-model="validate.k8sNamespaceSelection"
                    class="k-input w-100"
                    name="k8s-namespace-selection"
                    @change="updateStorage('k8sNamespaceSelection', $event.target.value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select a Namespace&hellip;
                    </option>
                    <option value="namespace-1">
                      Namespace-1
                    </option>
                    <option value="namespace-2">
                      Namespace-2
                    </option>
                    <option value="namespace-3">
                      Namespace-3
                    </option>
                  </select>
                  <input
                    v-if="validate.k8sNamespace === 'new-namespace'"
                    id="k8s-namespace-new"
                    v-model="validate.k8sNamespaceSelection"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-new-namespace"
                    required
                    @change="updateStorage('k8sNamespaceSelection', $event.target.value)"
                  >
                </FormFragment>
              </template>
            </KCard>

            <KCard
              v-if="validate.k8sServices === 'individual-services'"
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  title="Deployments"
                  for-attr="k8s-deployment-selection"
                >
                  <select
                    v-if="validate.k8sDeployment === 'existing-deployment'"
                    id="k8s-deployment-selection"
                    v-model="validate.k8sDeploymentSelection"
                    class="k-input w-100"
                    name="k8s-deployment-selection"
                    @change="updateStorage('k8sDeployment', $event.target.value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select a Deployment&hellip;
                    </option>
                    <option value="deployment-1">
                      Deployment-1
                    </option>
                    <option value="deployment-2">
                      Deployment-2
                    </option>
                    <option value="deployment-3">
                      Deployment-3
                    </option>
                  </select>
                  <input
                    v-if="validate.k8sDeployment === 'new-deployment'"
                    id="k8s-deployment-new"
                    v-model="validate.k8sDeploymentSelection"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-new-deployment"
                    required
                    @change="updateStorage('k8sDeployment', $event.target.value)"
                  >
                </FormFragment>
              </template>
            </KCard>
          </div>

          <div v-if="validate.k8sDataplaneType === 'dataplane-type-ingress'">
            <p>
              Is this a new Ingress that you want to deploy, or an existing one?
            </p>

            <!-- ingress selection -->
            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  all-inline
                  equal-cols
                  hide-label-col
                >
                  <label for="k8s-ingress-existing">
                    <input
                      id="k8s-ingress-existing"
                      v-model="validate.k8sIngressType"
                      class="k-input"
                      type="radio"
                      name="k8s-ingress-type"
                      value="existing-ingress"
                      checked
                    >
                    <span>
                      Existing Ingress
                    </span>
                  </label>
                  <label for="k8s-ingress-new">
                    <input
                      id="k8s-ingress-new"
                      v-model="validate.k8sIngressType"
                      class="k-input"
                      type="radio"
                      name="k8s-ingress-type"
                      value="new-ingress"
                    >
                    <span>
                      New Ingress
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <p>
              {{ title }} natively supports the Kong Ingress. Do you want to deploy
              Kong or another Ingress?
            </p>

            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  all-inline
                  equal-cols
                  hide-label-col
                >
                  <label for="k8s-ingress-kong">
                    <input
                      id="k8s-ingress-kong"
                      v-model="validate.k8sIngressBrand"
                      class="k-input"
                      type="radio"
                      name="k8s-ingress-brand"
                      value="kong-ingress"
                      checked
                    >
                    <span>
                      Kong Ingress
                    </span>
                  </label>
                  <label for="k8s-ingress-other">
                    <input
                      id="k8s-ingress-other"
                      v-model="validate.k8sIngressBrand"
                      class="k-input"
                      type="radio"
                      name="k8s-ingress-brand"
                      value="other-ingress"
                    >
                    <span>
                      Other Ingress
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <!-- namespace selection -->
            <KCard
              v-if="validate.k8sIngressBrand === 'kong-ingress'"
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  title="Ingress"
                  for-attr="k8s-ingress-type-selection"
                >
                  <select
                    v-if="validate.k8sIngressType === 'existing-ingress'"
                    id="k8s-ingress-type-selection"
                    v-model="validate.k8sIngressSelection"
                    class="k-input w-100"
                    name="k8s-ingress-type-selection"
                    @change="updateStorage('k8sIngressSelection', $event.target.value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select an Ingress&hellip;
                    </option>
                    <option value="ingress-1">
                      Ingress-1
                    </option>
                    <option value="ingress-2">
                      Ingress-2
                    </option>
                    <option value="ingress-3">
                      Ingress-3
                    </option>
                  </select>
                  <input
                    v-if="validate.k8sIngressType === 'new-ingress'"
                    id="k8s-ingress-type-selection"
                    v-model="validate.k8sIngressSelection"
                    type="text"
                    class="k-input w-100"
                    name="k8s-ingress-type-selection"
                    placeholder="your-new-ingress"
                    required
                    @change="updateStorage('k8sIngressSelection', $event.target.value)"
                  >
                </FormFragment>
              </template>
            </KCard>

            <KAlert
              v-if="validate.k8sIngressBrand === 'other-ingress'"
              appearance="info"
            >
              <template slot="alertMessage">
                <p>
                  Please go ahead and deploy the Ingress first, then restart this
                  wizard and select &quot;Existing Ingress&quot;.
                </p>
              </template>
            </KAlert>

            <KCard
              v-if="validate.k8sServices === 'individual-services'"
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  title="Deployments"
                  for-attr="k8s-deployment-selection"
                >
                  <select
                    v-if="validate.k8sDeployment === 'existing-deployment'"
                    id="k8s-deployment-selection"
                    class="k-input w-100"
                    name="k8s-deployment-selection"
                    @change="updateStorage('k8sDeployment', $event.target.value)"
                  >
                    <option value="deployment-1">
                      Deployment-1
                    </option>
                    <option value="deployment-2">
                      Deployment-2
                    </option>
                    <option value="deployment-3">
                      Deployment-3
                    </option>
                  </select>
                  <input
                    v-if="validate.k8sDeployment === 'new-deployment'"
                    id="k8s-deployment-new"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-new-deployment"
                    required
                    @change="updateStorage('k8sDeployment', $event.target.value)"
                  >
                </FormFragment>
              </template>
            </KCard>
          </div>
        </template>
        <template slot="complete">
          <div v-if="codeOutput">
            <div v-if="scanFound === false">
              <h3>
                Install a new Dataplane
              </h3>
              <p>
                You can now execute the following commands to automatically inject
                the sidebar proxy in every Pod, and by doing so creating the Dataplane.
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

          <div
            v-if="showDebugging"
            class="debugger"
          >
            <h4>
              Debugging info:
            </h4>
            <p>(does not appear in production)</p>
            <ul>
              <li
                v-for="(v, k) in validate"
                :key="k"
              >
                <strong>{{ k }}</strong>:<br>
                {{ v || 'not set yet' }}
              </li>
            </ul>
          </div>
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
    title: 'Create a new Dataplane on Kubernetes'
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
        k8sDataplaneType: 'dataplane-type-service',
        k8sServices: 'all-services',
        k8sNamespace: 'existing-namespace',
        k8sNamespaceSelection: '',
        k8sDeployment: 'existing-deployment',
        k8sDeploymentSelection: '',
        k8sIngressType: 'existing-ingress',
        k8sIngressBrand: 'kong-ingress',
        k8sIngressSelection: ''
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

    showDebugging () {
      return process.env.NODE_ENV === 'development'
    },

    instructionsCtaText () {
      return (this.environment === 'universal')
        ? 'Switch to Kubernetes instructions'
        : 'Switch to Universal instructions'
    },

    instructionsCtaRoute () {
      if (this.environment === 'kubernetes') {
        return { name: 'universal-dataplane' }
      } else {
        return { name: 'kubernetes-dataplane' }
      }
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
      this.$api.getDataplaneFromMesh(entity)
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
