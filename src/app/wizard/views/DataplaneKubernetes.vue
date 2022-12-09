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
          <h3>
            Create Kubernetes Dataplane
          </h3>
          <p>
            Welcome to the wizard to create a new Dataplane resource in {{ title }}.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the {{ productName }} GUI is read-only.
          </p>

          <h3>
            To get started, please select on what Mesh you would like to add the Dataplane:
          </h3>

          <p>
            If you've got an existing Mesh that you would like to associate with your
            Dataplane, you can select it below, or create a new one using our Mesh Wizard.
          </p>

          <small>Would you like to see instructions for Universal? Use sidebar to change wizard!</small>

          <!-- mesh selection -->
          <KCard
            class="my-6"
            has-shadow
          >
            <template #body>
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
                      Select an existing Mesh…
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
                    appearance="outline"
                  >
                    Create a new Mesh
                  </KButton>
                </div>
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template #scope-settings>
          <h3>
            Setup Dataplane Mode
          </h3>
          <p>
            You can create a data plane for a service or a data plane for a Gateway.
          </p>

          <!-- dataplane mode -->
          <KCard
            class="my-6"
            has-shadow
          >
            <template #body>
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
              <template #body>
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
                      disabled
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
              <template #body>
                <FormFragment
                  title="Deployments"
                  for-attr="k8s-deployment-selection"
                >
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

            <!-- namespace selection -->
            <KCard
              class="my-6"
              has-shadow
            >
              <template #body>
                <FormFragment
                  title="Namespace"
                  for-attr="k8s-namespace-selection"
                >
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
            <p>
              {{ title }} natively supports the Kong Ingress. Do you want to deploy
              Kong or another Ingress?
            </p>

            <KCard
              class="my-6"
              has-shadow
            >
              <template #body>
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
              <template #body>
                <FormFragment
                  title="Deployments"
                  for-attr="k8s-deployment-selection"
                >
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
              <template #alertMessage>
                <p>
                  Please go ahead and deploy the Ingress first, then restart this wizard and select “Existing Ingress”.
                </p>
              </template>
            </KAlert>
          </div>
        </template>
        <template #complete>
          <div v-if="validate.meshName">
            <div v-if="hideScannerSiblings === false">
              <h3>
                Auto-Inject DPP
              </h3>

              <p>
                You can now execute the following commands to automatically inject the sidecar proxy in every Pod, and by doing so creating the Dataplane.
              </p>

              <h4>Kubernetes</h4>

              <CodeBlock
                id="code-block-kubernetes-command"
                class="mt-3"
                language="bash"
                :code="codeOutput"
              />
            </div>
            <EntityScanner
              :loader-function="scanForEntity"
              :should-start="true"
              :has-error="scanError"
              :can-complete="scanFound"
              @hide-siblings="hideSiblings"
            >
              <template #loading-title>
                <h3>Searching…</h3>
              </template>
              <template #loading-content>
                <p>We are looking for your dataplane.</p>
              </template>
              <template #complete-title>
                <h3>Done!</h3>
              </template>

              <template #complete-content>
                <p>
                  Your Dataplane
                  <strong v-if="validate.k8sNamespaceSelection">
                    {{ validate.k8sNamespaceSelection }}
                  </strong>
                  was found!
                </p>
                <p>
                  Proceed to the next step where we will show you
                  your new Dataplane.
                </p>
                <p>
                  <KButton
                    appearance="primary"
                    @click="compeleteDataPlaneSetup"
                  >
                    View Your Dataplane
                  </KButton>
                </p>
              </template>
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
                Please return to the first step and make sure to select an
                existing Mesh, or create a new one.
              </p>
            </template>
          </KAlert>
        </template>

        <!-- sidebar content -->
        <template #dataplane>
          <h3>Dataplane</h3>
          <p>
            In {{ title }}, a Dataplane resource represents a data plane proxy running
            alongside one of your services. Data plane proxies can be added in any Mesh
            that you may have created, and in Kubernetes, they will be auto-injected
            by {{ title }}.
          </p>
        </template>
        <template #example>
          <h3>Example</h3>
          <p>
            Below is an example of a Dataplane resource output:
          </p>

          <CodeBlock
            id="onboarding-dpp-kubernetes-example"
            class="sample-code-block"
            :code="$options.EXAMPLE_CODE"
            language="yaml"
          />
        </template>
        <template #switch>
          <!-- wizard switcher -- based on environment -->
          <EnvironmentSwitcher />
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { KAlert, KButton, KCard } from '@kong/kongponents'

import { kumaApi } from '@/api/kumaApi'
import { kebabCase } from '@/utilities/helpers'
import CodeBlock from '@/app/common/CodeBlock.vue'
import { formatForCLI } from '../formatForCLI'
import FormFragment from '../components/FormFragment.vue'
import StepSkeleton from '../components/StepSkeleton.vue'
import EnvironmentSwitcher from '../components/EnvironmentSwitcher.vue'
import EntityScanner from '../components/EntityScanner.vue'

// schema for building code output (TBD)
import dataplaneSchema from './DataplaneKubernetesSchema'
import { PRODUCT_NAME } from '@/constants'

const EXAMPLE_CODE = `apiVersion: 'kuma.io/v1alpha1'
kind: Dataplane
mesh: default
metadata:
  name: dp-echo-1
  annotations:
    kuma.io/sidecar-injection: enabled
    kuma.io/mesh: default
networking:
  address: 10.0.0.1
  inbound:
  - port: 10000
    servicePort: 9000
    tags:
      kuma.io/service: echo`

export default {
  name: 'DataplaneWizardKubernetes',

  EXAMPLE_CODE,

  components: {
    CodeBlock,
    FormFragment,
    StepSkeleton,
    EnvironmentSwitcher,
    EntityScanner,
    KAlert,
    KButton,
    KCard,
  },

  data() {
    return {
      productName: PRODUCT_NAME,
      schema: dataplaneSchema,
      steps: [
        {
          label: 'General',
          slug: 'general',
        },
        {
          label: 'Scope Settings',
          slug: 'scope-settings',
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
      ],
      sidebarContent: [
        {
          name: 'dataplane',
        },
        {
          name: 'example',
        },
        {
          name: 'switch',
        },
      ],
      startScanner: false,
      scanFound: false,
      hideScannerSiblings: false,
      scanError: false,
      isComplete: false,
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
        k8sIngressSelection: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      version: 'config/getVersion',
      environment: 'config/getEnvironment',
      meshes: 'getMeshList',
    }),

    // Our generated code output
    codeOutput() {
      const schema = Object.assign({}, this.schema)
      const namespace = this.validate.k8sNamespaceSelection

      // if no namespace is set, do nothing
      if (!namespace) return

      // name and namespace
      schema.metadata.name = namespace
      schema.metadata.namespace = namespace

      // selected mesh
      schema.metadata.annotations['kuma.io/mesh'] = this.validate.meshName

      /**
       * Finalized output
       */

      // const codeBlock = { ...meshType, spec: { ...schema } }
      const codeClosing = `" | kubectl apply -f - && kubectl delete pod --all -n ${namespace}`
      const assembledBlock = formatForCLI(schema, codeClosing)

      return assembledBlock
    },

    nextDisabled() {
      const { k8sNamespaceSelection, meshName } = this.validate

      if (!meshName.length) {
        return true
      }

      if (this.$route.query.step === '1') {
        return !k8sNamespaceSelection
      }

      return false
    },
  },
  watch: {
    'validate.k8sNamespaceSelection'(value) {
      this.validate.k8sNamespaceSelection = kebabCase(value)
    },

    $route() {
      const step = this.$route.query.step

      if (step === 1) {
        if (this.validate.k8sNamespaceSelection) {
          this.nextDisabled = false
        } else {
          this.nextDisabled = true
        }
      }
    },
  },
  methods: {
    hideSiblings() {
      // this triggers when to hide the siblings related to the Scanner
      // component that need to be hidden once the scan succeeds.
      this.hideScannerSiblings = true
    },
    scanForEntity() {
      // get our entity from the VueX store
      const entity = this.validate
      const mesh = entity.meshName
      const dataplane = this.validate.k8sNamespaceSelection // this is a placeholder

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there is no Mesh nor Dataplane found
      if (!mesh || !dataplane) return

      kumaApi.getDataplaneFromMesh({ mesh, name: dataplane })
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
    compeleteDataPlaneSetup() {
      this.$store.dispatch('updateSelectedMesh', this.validate.meshName)

      this.$router.push({
        name: 'data-plane-list-view',
        params: {
          mesh: this.validate.meshName,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
input:disabled + span {
  color: var(--grey-500);
}

.sample-code-block {
  --KCodeBlockBackgroundColor: var(--white);
}
</style>
