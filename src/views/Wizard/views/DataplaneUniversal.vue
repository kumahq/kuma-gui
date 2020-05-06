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
        <template slot="topology">
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
              </FormFragment>
            </template>
          </KCard>

          <FormFragment
            all-inline
            title="Service name"
          >
            <input
              id="service-name"
              v-model="validate.univDataplaneServiceName"
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
              <KPop trigger="hover">
                <input
                  id="dataplane-id"
                  v-model="validate.univDataplaneId"
                  type="text"
                  class="k-input w-100"
                  :disabled="validate.univDataplaneCustomIdDisabled"
                >
                <div slot="content">
                  This is a unique ID for the Dataplane instance.
                </div>
              </KPop>
            </div>
            <div>
              <KButton
                appearance="primary"
                @click="validate.univDataplaneCustomIdDisabled = false"
              >
                Edit
              </KButton>
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
          <FormFragment
            title="Address"
            for-attr="network-address"
          >
            <KPop trigger="hover">
              <input
                id="network-address"
                v-model="validate.univDataplaneNetworkAddress"
                placeholder="127.0.0.1"
                type="text"
                class="k-input w-100"
              >
              <div slot="content">
                The IP address that other services will use to consume this data plane.
              </div>
            </KPop>
          </FormFragment>
          <FormFragment
            title="Service Port"
            for-attr="network-service-port"
          >
            <KPop trigger="hover">
              <input
                id="network-service-port"
                v-model="validate.univDataplaneNetworkServicePort"
                placeholder="9000"
                type="text"
                class="k-input w-100"
              >
              <div slot="content">
                The port where your service is listening on the machine.
              </div>
            </KPop>
          </FormFragment>
          <FormFragment
            title="Data plane port"
            for-attr="network-dataplane-port"
          >
            <KPop trigger="hover">
              <input
                id="network-dataplane-port"
                v-model="validate.univDataplaneNetworkDPPort"
                placeholder="10000"
                type="text"
                class="k-input w-100"
              >
              <div slot="content">
                The data plane port (that other services will use to consume this service).
              </div>
            </KPop>
          </FormFragment>
          <FormFragment
            title="Protocol"
            for-attr="network-dataplane-protocol"
          >
            <KPop trigger="hover">
              <select
                id="network-dataplane-protocol"
                v-model="validate.univDataplaneNetworkProtocol"
                class="k-input w-100"
                name="network-dataplane-protocol"
              >
                <option
                  value="tcp"
                  :selected="validate.univDataplaneNetworkProtocol === 'tcp'"
                >
                  TCP
                </option>
                <option
                  value="http"
                  :selected="validate.univDataplaneNetworkProtocol === 'http'"
                >
                  HTTP
                </option>
              </select>
              <div slot="content">
                The protocol of the service.
              </div>
            </KPop>
          </FormFragment>
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
                initial-tab-override="universal"
              >
                <!-- <template slot="kubernetes">
                  <CodeView
                    title="Kubernetes"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template> -->
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
                <p>We are looking for your dataplane.</p>
              </template>
              <!-- complete -->
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
                Please return to the first step and make sure to select an
                existing Mesh, or create a new one.
              </p>
            </template>
          </KAlert>
        </template>
        <template slot="start">
          <h3>
            Start your new Dataplane
          </h3>
          <Tabs
            :loaders="false"
            :tabs="tabs"
            :has-border="true"
            initial-tab-override="universal"
          >
            <!-- <template slot="kubernetes">
                  <CodeView
                    title="Kubernetes"
                    copy-button-text="Copy Command to Clipboard"
                    lang="bash"
                    :content="codeOutput"
                  />
                </template> -->
            <template slot="universal">
              <CodeView
                title="Universal"
                copy-button-text="Copy Command to Clipboard"
                lang="bash"
                :content="codeOutput"
              />
            </template>
          </Tabs>
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
  address: 127.0.0.1
  inbound:
  - port: 10000
    servicePort: 9000
    tags:
      service: echo</pre>
          </code>
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
        },
        {
          label: 'Start',
          slug: 'start'
        }
      ],
      tabs: [
        // {
        //   hash: '#kubernetes',
        //   title: 'Kubernetes'
        // }
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
        }
      ],
      startScanner: false,
      scanFound: false,
      scanError: false,
      isComplete: false,
      nextDisabled: true,
      validate: {
        meshName: '',
        univDataplaneType: 'dataplane-type-service',
        univDataplaneServiceName: '',
        univDataplaneId: '', // TODO this has to bind with a random ID
        univDataplaneCustomIdDisabled: true,
        univDataplaneNetworkAddress: '',
        univDataplaneNetworkServicePort: '',
        univDataplaneNetworkDPPort: '',
        univDataplaneNetworkProtocol: 'tcp'
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

    randString () {
      return Math.random().toString(36).substring(2, 8)
    },

    // Our generated code output
    codeOutput () {
      const schema = Object.assign({}, this.schema)

      const {
        meshName,
        univDataplaneType,
        univDataplaneServiceName,
        univDataplaneId,
        univDataplaneNetworkAddress,
        univDataplaneNetworkServicePort,
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
              tags: {
                service: univDataplaneServiceName,
                protocol: univDataplaneNetworkProtocol
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
          gateway: [
            {
              tags: {
                service: univDataplaneServiceName
              }
            }
          ]
        }
      }

      /**
       * Finalized output
       */

      // const codeBlock = { ...meshType, spec: { ...schema } }
      const codeClosing = `" | kubectl apply -f && kubectl delete pod --all -n ${univDataplaneId}`
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
      },
      deep: true
    },

    'validate.univDataplaneId' (value) {
      const newId = (value)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      this.validate.univDataplaneId = newId
    },

    'validate.univDataplaneServiceName' (value) {
      const newName = (value)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const newStr = (`${value}-${this.randString}`)
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      this.validate.univDataplaneServiceName = newName

      if (this.validate.univDataplaneServiceName === '') {
        this.validate.univDataplaneId = ''
      } else {
        this.validate.univDataplaneId = newStr
      }
    }
  },
  methods: {
    scanForEntity () {
      const entity = this.validate
      const mesh = entity.meshName
      const dataplane = entity.univDataplaneServiceName

      // reset things if the user is starting over
      this.scanComplete = false
      this.scanError = false

      // do nothing if there is no Mesh nor Dataplane found
      if (!mesh || !dataplane) return

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
