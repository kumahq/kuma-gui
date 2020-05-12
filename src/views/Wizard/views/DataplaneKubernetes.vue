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

          <!-- wizard switcher -- based on environment -->
          <Switcher />

          <h3>
            To get started, please select on what Mesh you would like to add the Dataplane:
          </h3>

          <p>
            If you've got an existing Mesh that you would like to associate with your
            Dataplane, you can select it below, or create a new one using our Mesh Wizard.
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
                    disabled
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
                      disabled="disabled"
                    >
                    <span>
                      Individual Services
                    </span>
                  </label>
                </FormFragment>
              </template>
            </KCard>

            <!-- <KCard
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
                      v-model="validate.k8sServiceDeployment"
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
                      v-model="validate.k8sServiceDeployment"
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
            </KCard> -->

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
                  <!-- <select
                    v-if="validate.k8sServiceDeployment === 'existing-deployment'"
                    id="k8s-service-deployment-selection"
                    v-model="validate.k8sServiceDeploymentSelection"
                    class="k-input w-100"
                    name="k8s-deployment-selection"
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
                  </select> -->
                  <input
                    id="k8s-service-deployment-new"
                    v-model="validate.k8sServiceDeploymentSelection"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-new-deployment"
                    required
                  >
                </FormFragment>
              </template>
            </KCard>

            <!-- namespace selection options -->
            <!-- <KCard
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
            </KCard> -->

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
                  <!-- <select
                    v-if="validate.k8sNamespace === 'existing-namespace'"
                    id="k8s-namespace-selection"
                    v-model="validate.k8sNamespaceSelection"
                    class="k-input w-100"
                    name="k8s-namespace-selection"
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
                  </select> -->
                  <input
                    id="k8s-namespace-new"
                    v-model="validate.k8sNamespaceSelection"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-namespace"
                    required
                  >
                </FormFragment>
              </template>
            </KCard>
          </div>

          <div v-if="validate.k8sDataplaneType === 'dataplane-type-ingress'">
            <!-- <p>
              Is this a new Ingress that you want to deploy, or an existing one?
            </p> -->

            <!-- ingress type selection -->
            <!-- <KCard
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
            </KCard> -->

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

            <KCard
              class="my-6"
              has-shadow
            >
              <template slot="body">
                <FormFragment
                  title="Deployments"
                  for-attr="k8s-deployment-selection"
                >
                  <!-- <select
                    v-if="validate.k8sIngressType === 'existing-ingress'"
                    id="k8s-ingress-deployment-selection"
                    v-model="validate.k8sIngressDeploymentSelection"
                    class="k-input w-100"
                    name="k8s-ingress-selection"
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
                  </select> -->
                  <input
                    id="k8s-ingress-deployment-new"
                    v-model="validate.k8sIngressDeployment"
                    type="text"
                    class="k-input w-100"
                    placeholder="your-deployment"
                    required
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
          </div>
        </template>
        <template slot="complete">
          <div v-if="validate.meshName">
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
                initial-tab-override="kubernetes"
              >
                <template slot="kubernetes">
                  <CodeView
                    title="Kubernetes"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template>
                <!-- <template slot="universal">
                  <CodeView
                    title="Universal"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template> -->
              </Tabs>
            </div>
            <!-- <Scanner
              :loader-function="scanForEntity"
              :should-start="true"
              :has-error="scanError"
              :can-complete="scanFound"
            >
              <template slot="loading-title">
                <h3>Searching&hellip;</h3>
              </template>
              <template slot="loading-content">
                <p>We are looking for your dataplane.</p>
              </template>
              <template slot="complete-title">
                <h3>Done!</h3>
              </template>
              <template slot="complete-content">
                <p>
                  Your Dataplane
                  <strong v-if="validate.k8sNamespaceSelection">
                    {{ validate.k8sNamespaceSelection }}
                  </strong>
                  was found!
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
              <template slot="error-title">
                <h3>Mesh not found</h3>
              </template>
              <template slot="error-content">
                <p>We were unable to find your mesh.</p>
              </template>
            </Scanner> -->
          </div>
          <KAlert
            v-else
            appearance="danger"
          >
            <template slot="alertMessage">
              <p>
                Please return to the first step and make sure to select an
                existing Mesh, or create a new one.
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
import Switcher from '@/views/Wizard/components/Switcher'
import CodeView from '@/components/Skeletons/CodeView'
import Scanner from '@/views/Wizard/components/Scanner'

// schema for building code output
// import meshSchema from '@/views/Wizard/schemas/Mesh'

// schema for building code output (TBD)
import dataplaneSchema from '@/views/Wizard/schemas/DataplaneKubernetes'

export default {
  name: 'DataplaneWizardKubernetes',
  metaInfo: {
    title: 'Create a new Dataplane on Kubernetes'
  },
  components: {
    FormFragment,
    Tabs,
    StepSkeleton,
    Switcher,
    CodeView,
    Scanner
  },
  mixins: [
    FormatForCLI,
    updateStorage
  ],
  data () {
    return {
      schema: dataplaneSchema,
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
        }
        // {
        //   hash: '#universal',
        //   title: 'Universal'
        // }
      ],
      sidebarContent: [
        {
          name: 'dataplane'
        }
      ],
      startScanner: false,
      scanFound: false,
      scanError: false,
      isComplete: false,
      nextDisabled: true,
      validate: {
        meshName: '',
        k8sDataplaneType: 'dataplane-type-service',
        k8sServices: 'all-services',
        k8sNamespace: '',
        k8sNamespaceSelection: '',
        k8sServiceDeployment: '',
        k8sServiceDeploymentSelection: '',
        k8sIngressDeployment: '',
        k8sIngressDeploymentSelection: '',
        k8sIngressType: '',
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

    // Our generated code output
    codeOutput () {
      const schema = Object.assign({}, this.schema)
      const namespace = this.validate.k8sNamespaceSelection

      // if no namespace is set, do nothing
      if (!namespace) return

      // name and namespace
      schema.metadata.name = namespace
      schema.metadata.namespace = namespace

      // selected mesh
      schema.metadata.labels['kuma.io/mesh'] = this.validate.meshName

      /**
       * Finalized output
       */

      // const codeBlock = { ...meshType, spec: { ...schema } }
      const codeClosing = `" | kubectl apply -f - && kubectl delete pod --all -n ${namespace}`
      const assembledBlock = this.formatForCLI(schema, codeClosing)

      return assembledBlock
    }
  },
  watch: {
    validate: {
      handler () {
        const data = JSON.stringify(this.validate)
        const mesh = this.validate.meshName

        // write the v-model data to localStorage whenever it changes
        localStorage.setItem('storedFormData', data)

        // allow the user to proceed if they've selected a Mesh
        mesh.length
          ? this.nextDisabled = false
          : this.nextDisabled = true

        // namespace validation
        if (this.$route.query.step === 1) {
          if (this.validate.k8sNamespaceSelection) {
            this.nextDisabled = false
          } else {
            this.nextDisabled = true
          }
        }
      },
      deep: true
    },

    'validate.k8sNamespaceSelection' (value) {
      const newId = (value)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      this.validate.k8sNamespaceSelection = newId
    },

    '$route' () {
      const step = this.$route.query.step

      if (step === 1) {
        if (this.validate.k8sNamespaceSelection) {
          this.nextDisabled = false
        } else {
          this.nextDisabled = true
        }
      }
    }
  },
  methods: {
    scanForEntity () {
      // get our entity from the VueX store
      const entity = this.validate
      const mesh = entity.meshName
      const dataplane = 'test' // this is a placeholder

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there is no Mesh nor Dataplane found
      if (!mesh || !dataplane) return

      /**
       * TODO
       * this will eventually change to `this.$api.getDataplaneFromMesh()`
       * we will need to get the Mesh namespace the user selects, or the one
       * they create, as well as the Dataplane namespace.
       *
       * This is also dependent upon multiple Kubernetes endpoints that don't
       * yet exist in Kuma and need to be created.
       *
       */
      this.$api.getDataplaneFromMesh(mesh, dataplane)
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

<style lang="scss" scoped>
input:disabled + span {
  color: #999;
  // font-style: italic;
}
</style>
