<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="STEPS"
        :sidebar-content="SIDEBAR_CONTENT"
        :footer-enabled="hideScannerSiblings === false"
        :next-disabled="nextDisabled"
        @go-to-step="setStep"
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
            As you know, the {{ PRODUCT_NAME }} GUI is read-only.
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
                      v-for="item in store.getters['getMeshList'].items"
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
                    @click="completeDataPlaneSetup"
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
            :code="EXAMPLE_CODE"
            language="yaml"
          />
        </template>

        <template #switch>
          <EnvironmentSwitcher />
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KAlert, KButton, KCard } from '@kong/kongponents'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import dataplaneSchema from './DataplaneKubernetesSchema'
import EntityScanner from '../components/EntityScanner.vue'
import EnvironmentSwitcher from '../components/EnvironmentSwitcher.vue'
import FormFragment from '../components/FormFragment.vue'
import StepSkeleton from '../components/StepSkeleton.vue'
import { formatForCLI } from '../formatForCLI'
import CodeBlock from '@/app/common/CodeBlock.vue'
import { PRODUCT_NAME } from '@/constants'
import { useStore } from '@/store/store'
import { useKumaApi } from '@/utilities'
import { kebabCase } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()

const EXAMPLE_CODE = `apiVersion: 'kuma.io/v1alpha1'
kind: Dataplane
mesh: default
metadata:
  name: dp-echo-1
  labels:
    kuma.io/sidecar-injection: enabled
  annotations:
    kuma.io/mesh: default
networking:
  address: 10.0.0.1
  inbound:
  - port: 10000
    servicePort: 9000
    tags:
      kuma.io/service: echo`

const STEPS = [
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
]

const SIDEBAR_CONTENT = [
  {
    name: 'dataplane',
  },
  {
    name: 'example',
  },
  {
    name: 'switch',
  },
]

const router = useRouter()
const store = useStore()

const schema = ref(dataplaneSchema)
const step = ref(0)
const scanFound = ref(false)
const hideScannerSiblings = ref(false)
const scanError = ref(false)
const isComplete = ref(false)
const validate = ref({
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
})

const title = computed(() => store.getters['config/getTagline'])
const codeOutput = computed(() => {
  const schemaCopy: any = Object.assign({}, schema.value)
  const namespace = validate.value.k8sNamespaceSelection

  if (!namespace) {
    return ''
  }

  schemaCopy.metadata.name = namespace
  schemaCopy.metadata.namespace = namespace
  schemaCopy.metadata.annotations['kuma.io/mesh'] = validate.value.meshName

  const codeClosing = `" | kubectl apply -f - && kubectl delete pod --all -n ${namespace}`
  const assembledBlock = formatForCLI(schemaCopy, codeClosing)

  return assembledBlock
})

const nextDisabled = computed(() => {
  const { k8sNamespaceSelection, meshName } = validate.value

  if (meshName.length === 0) {
    return true
  }

  if (step.value === 1) {
    return !k8sNamespaceSelection
  }

  return false
})

watch(() => validate.value.k8sNamespaceSelection, function (value) {
  validate.value.k8sNamespaceSelection = kebabCase(value)
})

const stepParameter = QueryParameter.get('step')
step.value = stepParameter !== null ? parseInt(stepParameter) : 0

function setStep(newStep: number): void {
  step.value = newStep
}

function hideSiblings(): void {
  // this triggers when to hide the siblings related to the Scanner
  // component that need to be hidden once the scan succeeds.
  hideScannerSiblings.value = true
}

async function scanForEntity() {
  // get our entity from the VueX store
  const entity = validate.value
  const mesh = entity.meshName
  const dataplane = validate.value.k8sNamespaceSelection // this is a placeholder

  // reset things if the user is starting over
  isComplete.value = false
  scanError.value = false

  // do nothing if there is no Mesh nor Dataplane found
  if (!mesh || !dataplane) return

  try {
    const response = await kumaApi.getDataplaneFromMesh({ mesh, name: dataplane })
    if (response && response.name.length > 0) {
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

function completeDataPlaneSetup(): void {
  store.dispatch('updateSelectedMesh', validate.value.meshName)

  router.push({
    name: 'data-planes-list-view',
    params: {
      mesh: validate.value.meshName,
    },
  })
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
