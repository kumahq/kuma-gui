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
        <template slot="general">
          <h3>
            Create Universal Dataplane
          </h3>
          <p>
            Welcome to the wizard to create a new Dataplane resource in {{ title }}.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the {{ $productName }} GUI is read-only.
          </p>

          <h3>
            To get started, please select on what Mesh you would like to add the Dataplane:
          </h3>

          <p>
            If you've got an existing Mesh that you would like to associate with your
            Dataplane, you can select it below, or create a new one using our Mesh Wizard.
          </p>

          <small>Would you like to see instructions for Kubernetes? Use sidebar to change wizard!</small>

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
                    data-testid="mesh-select"
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
                    appearance="secondary"
                  >
                    Create a new Mesh
                  </KButton>
                </div>
              </FormFragment>
            </template>
          </KCard>
        </template>
        <template slot="topology">
          <h3>
            Setup Dataplane Mode
          </h3>
          <p>
            You can create a data plane for a service or a data plane for a Gateway.
          </p>

          <!-- dataplane mode -->
          <FormFragment
            all-inline
            equal-cols
            hide-label-col
            shift-right
          >
            <div>
              <label for="service-dataplane">
                <input
                  id="service-dataplane"
                  v-model="validate.univDataplaneType"
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
              <label for="gateway-dataplane">
                <input
                  id="gateway-dataplane"
                  v-model="validate.univDataplaneType"
                  class="k-input"
                  type="radio"
                  name="dataplane-type"
                  value="dataplane-type-gateway"
                >
                <span>
                  Gateway Dataplane
                </span>
              </label>
            </div>
          </FormFragment>

          <FormFragment
            all-inline
            title="Service name"
            for-attr="service-name"
          >
            <input
              id="service-name"
              v-model="validate.univDataplaneServiceName"
              data-testid="service-name"
              type="text"
              class="k-input w-100 mr-4"
            >
          </FormFragment>
          <FormFragment
            all-inline
            title="Dataplane ID"
            for-attr="dataplane-id"
          >
            <div>
              <input
                id="dataplane-id"
                v-model="validate.univDataplaneId"
                type="text"
                class="k-input w-100"
                :disabled="validate.univDataplaneCustomIdDisabled"
              >
            </div>
            <div>
              <KButton
                appearance="secondary"
                @click="validate.univDataplaneCustomIdDisabled = false"
              >
                Edit
              </KButton>
              <HelperTooltip>
                This is a unique ID for the Dataplane instance.
              </HelperTooltip>
            </div>
          </FormFragment>
        </template>
        <template slot="networking">
          <h3>
            Networking
          </h3>
          <p>
            It's time to now configure the networking settings so that the Dataplane
            can connect to the local service, and other data planes can consume
            your service.
          </p>
          <p>
            <strong>All fields below are required to proceed.</strong>
          </p>
          <!-- network address -->
          <FormFragment
            all-inline
            title="Data Plane IP Address"
            for-attr="network-address"
          >
            <input
              id="network-address"
              v-model="validate.univDataplaneNetworkAddress"
              type="text"
              class="k-input w-100"
            >
            <HelperTooltip>
              The IP address that other services will use to consume this data plane.
            </HelperTooltip>
          </FormFragment>
          <!-- data plane port -->
          <FormFragment
            all-inline
            fill-first
            title="Data Plane Port"
            for-attr="network-dataplane-port"
          >
            <input
              id="network-dataplane-port"
              v-model="validate.univDataplaneNetworkDPPort"
              type="text"
              class="k-input w-100"
            >
            <HelperTooltip>
              The data plane port (that other services will use to consume this service).
            </HelperTooltip>
          </FormFragment>
          <!-- service address -->
          <FormFragment
            all-inline
            title="Service IP Address"
            for-attr="network-service-address"
          >
            <input
              id="network-service-address"
              v-model="validate.univDataplaneNetworkServiceAddress"
              type="text"
              class="k-input w-100"
            >
            <HelperTooltip>
              The address where your service is listening on the machine.
            </HelperTooltip>
          </FormFragment>
          <!-- service port -->
          <FormFragment
            all-inline
            title="Service Port"
            for-attr="network-service-port"
          >
            <input
              id="network-service-port"
              v-model="validate.univDataplaneNetworkServicePort"
              type="text"
              class="k-input w-100"
            >
            <HelperTooltip>
              The port where your service is listening on the machine.
            </HelperTooltip>
          </FormFragment>
          <!-- protocol -->
          <FormFragment
            all-inline
            title="Protocol"
            for-attr="network-dataplane-protocol"
          >
            <select
              id="network-dataplane-protocol"
              v-model="validate.univDataplaneNetworkProtocol"
              class="k-input w-100"
              name="network-dataplane-protocol"
            >
              <option
                v-for="(option, idx) in formFields.protocols"
                :key="idx"
                :value="option"
                :selected="validate.univDataplaneNetworkProtocol === option"
              >
                {{ option }}
              </option>
            </select>
            <HelperTooltip>
              The protocol of the service.
            </HelperTooltip>
          </FormFragment>
        </template>

        <template slot="complete">
          <div v-if="validate.meshName">
            <div
              v-if="hideScannerSiblings === false"
            >
              <h3>
                Auto-Inject DPP
              </h3>
              <p>
                It's time to first generate the credentials so that {{ title }} will allow
                the Dataplane to successfully authenticate itself with the control plane,
                and then finally install the Dataplane process (powered by Envoy).
              </p>
              <Tabs
                :loaders="false"
                :tabs="tabs"
                :has-border="true"
                initial-tab-override="universal"
              >
                <template slot="universal">
                  <CodeView
                    title="Generate Dataplane Token"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="generateDpTokenCodeOutput"
                  />
                  <CodeView
                    title="Start Dataplane Process"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="startDpCodeOutput"
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
                <p>We are looking for your dataplane.</p>
              </template>
              <!-- complete -->
              <template slot="complete-title">
                <h3>Done!</h3>
              </template>
              <template slot="complete-content">
                <p>
                  Your Dataplane
                  <strong v-if="validate.univDataplaneId">
                    {{ validate.univDataplaneId }}
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
              <!-- error -->
              <template slot="error-title">
                <h3>Dataplane not found</h3>
              </template>
              <template slot="error-content">
                <p>We were unable to find your dataplane.</p>
              </template>
            </Scanner>
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
            In {{ title }}, a Dataplane resource represents a data plane proxy running
            alongside one of your services. Data plane proxies can be added in any Mesh
            that you may have created, and in Kubernetes, they will be auto-injected
            by {{ title }}.
          </p>
        </template>

        <template slot="example">
          <h3>Example</h3>
          <p>
            Below is an example of a Dataplane resource output:
          </p>
          <code>
            <pre>type: Dataplane
mesh: default
name: dp-echo-1
networking:
  address: 10.0.0.1
  inbound:
  - port: 10000
    servicePort: 9000
    tags:
      kuma.io/service: echo</pre>
          </code>
        </template>
        <template slot="switch">
          <!-- wizard switcher -- based on environment -->
          <Switcher />
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { kumaDpServerUrl } from '@/configUrl'
import { kebabCase } from '@/helpers'
import json2yaml from '@appscode/json2yaml'
import FormFragment from '@/views/Wizard/components/FormFragment'
import Tabs from '@/components/Utils/Tabs'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton'
import Switcher from '@/views/Wizard/components/Switcher'
import HelperTooltip from '@/views/Wizard/components/HelperTooltip'
import CodeView from '@/components/Skeletons/CodeView'
import Scanner from '@/views/Wizard/components/Scanner'

// schema for building code output
import dataplaneSchema from '@/views/Wizard/schemas/DataplaneUniversal'

export default {
  name: 'DataplaneWizardUniversal',
  metaInfo: {
    title: 'Create a new Dataplane on Universal'
  },
  components: {
    FormFragment,
    Tabs,
    StepSkeleton,
    Switcher,
    HelperTooltip,
    CodeView,
    Scanner
  },
  data () {
    return {
      randString: Math
        .random()
        .toString(36)
        .substring(2, 8),
      schema: dataplaneSchema,
      steps: [
        {
          label: 'General',
          slug: 'general'
        },
        {
          label: 'Topology',
          slug: 'topology'
        },
        {
          label: 'Networking',
          slug: 'networking'
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
        }
      ],
      sidebarContent: [
        {
          name: 'dataplane'
        },
        {
          name: 'example'
        },
        {
          name: 'switch'
        }
      ],
      startScanner: false,
      scanFound: false,
      hideScannerSiblings: false,
      scanError: false,
      isComplete: false,
      validate: {
        meshName: '',
        univDataplaneType: 'dataplane-type-service',
        univDataplaneServiceName: '',
        univDataplaneId: '',
        univDataplaneCustomIdDisabled: true,
        univDataplaneNetworkAddress: null,
        univDataplaneNetworkServicePort: null,
        univDataplaneNetworkServiceAddress: '127.0.0.1',
        univDataplaneNetworkDPPort: null,
        univDataplaneNetworkProtocol: 'tcp'
      },
      formFields: {
        protocols: [
          'tcp',
          'http',
          'grpc'
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      version: 'config/getVersion',
      environment: 'config/getEnvironment',
      selectedTab: 'getSelectedTab',
      meshes: 'getMeshList'
    }),

    getDataplaneSchema() {
      const schema = Object.assign({}, this.schema)

      const {
        meshName,
        univDataplaneType,
        univDataplaneServiceName,
        univDataplaneId,
        univDataplaneNetworkAddress,
        univDataplaneNetworkServicePort,
        univDataplaneNetworkServiceAddress,
        univDataplaneNetworkDPPort,
        univDataplaneNetworkProtocol
      } = this.validate

      // if no namespace is set, do nothing
      if (!meshName) return

      // namespace and mesh association
      schema.name = univDataplaneId
      schema.mesh = meshName

      // networking
      if (univDataplaneType === 'dataplane-type-service') {
        if (schema.networking.gateway) {
          delete schema.networking.gateway
        }

        schema.networking = {
          address: univDataplaneNetworkAddress,
          inbound: [
            {
              port: univDataplaneNetworkDPPort,
              servicePort: univDataplaneNetworkServicePort,
              serviceAddress: univDataplaneNetworkServiceAddress,
              tags: {
                'kuma.io/service': univDataplaneServiceName,
                'kuma.io/protocol': univDataplaneNetworkProtocol
              }
            }
          ]
        }
      } else if (univDataplaneType === 'dataplane-type-gateway') {
        if (schema.networking.inbound) {
          delete schema.networking.inbound
        }

        schema.networking = {
          address: univDataplaneNetworkAddress,
          gateway: {
            tags: {
              'kuma.io/service': univDataplaneServiceName
            }
          }
        }
      }

      return schema
    },

    /**
     * Part 1 of the last step: Generate the Dataplane Token
     */
    generateDpTokenCodeOutput () {
      const { univDataplaneId } = this.validate

      const cmdStructure = `kumactl generate dataplane-token --name=${univDataplaneId} > kuma-token-${univDataplaneId}`

      return cmdStructure
    },

    /**
     * Part 2 of the last step: Install the Dataplane
     */
    startDpCodeOutput () {
      // const cpAddress = this.$store.getters.getConfig.general.advertisedHostname
      const { univDataplaneId } = this.validate
      const cmdStructure = `kuma-dp run \\
      --cp-address=${kumaDpServerUrl()} \\
      --dataplane=${`"${json2yaml(this.getDataplaneSchema)}"`} \\
      --dataplane-token-file=kuma-token-${univDataplaneId}`

      return cmdStructure
    },

    nextDisabled() {
      const {
        meshName,
        univDataplaneServiceName,
        univDataplaneId,
        univDataplaneNetworkAddress,
        univDataplaneNetworkServicePort,
        univDataplaneNetworkDPPort,
        univDataplaneNetworkProtocol
      } = this.validate

      if (!meshName.length) {
        return true
      }

      if (this.$route.query.step === '1') {
        return !(univDataplaneServiceName && univDataplaneId)
      }

      if (this.$route.query.step === '2') {
        return !(
          univDataplaneNetworkAddress &&
            univDataplaneNetworkServicePort &&
            univDataplaneNetworkDPPort &&
            univDataplaneNetworkProtocol
        )
      }

      return false
    }
  },
  watch: {

    'validate.univDataplaneId' (value) {
      this.validate.univDataplaneId = kebabCase(value)
    },

    'validate.univDataplaneServiceName' (value) {
      const newName = kebabCase(value)

      this.validate.univDataplaneServiceName = newName

      if (this.validate.univDataplaneServiceName === '') {
        this.validate.univDataplaneId = ''
      } else {
        this.validate.univDataplaneId = kebabCase(`${value}-${this.randString}`)
      }
    },

    'validate.univDataplaneNetworkServicePort' (value) {
      const newId = (value)
        .replace(/[a-zA-Z]*$/g, '')
        .trim()

      this.validate.univDataplaneNetworkServicePort = newId
    },

    'validate.univDataplaneNetworkDPPort' (value) {
      const newId = (value)
        .replace(/[a-zA-Z]*$/g, '')
        .trim()

      this.validate.univDataplaneNetworkDPPort = newId
    }
  },
  methods: {
    hideSiblings () {
      // this triggers when to hide the siblings related to the Scanner
      // component that need to be hidden once the scan succeeds.
      this.hideScannerSiblings = true
    },
    scanForEntity () {
      const { meshName, univDataplaneId } = this.validate

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there is no Mesh nor Dataplane found
      if (!meshName || !univDataplaneId) return

      this.$api.getDataplaneFromMesh(meshName, univDataplaneId)
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
    },
    compeleteDataPlaneSetup() {
      this.$store.dispatch('updateSelectedMesh', this.validate.meshName)
      localStorage.setItem('selectedMesh', this.validate.meshName)

      this.$router.push({
        name: 'dataplanes',
        params: {
          mesh: this.validate.meshName,
        }
      })
    }
  }
}
</script>
