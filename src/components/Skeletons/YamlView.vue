<template>
  <div class="yaml-view">
    <div
      v-if="isReady"
      class="yaml-view-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
        border-variant="noBorder"
      >
        <template slot="body">
          <KTabs
            :key="environment"
            v-model="activeTab.hash"
            :tabs="tabs"
          >
            <template slot="universal">
              <KClipboardProvider v-slot="{ copyToClipboard }">
                <KPop placement="bottom">
                  <KButton
                    class="copy-button"
                    appearance="primary"
                    size="small"
                    @click="() => {
                      copyToClipboard(yamlContent.universal)
                    }"
                  >
                    Copy Universal YAML
                  </KButton>
                  <div slot="content">
                    <p>Entity copied to clipboard!</p>
                  </div>
                </KPop>
              </KClipboardProvider>
              <prism
                class="code-block"
                language="yaml"
                :code="yamlContent.universal"
              />
            </template>
            <template slot="kubernetes">
              <KClipboardProvider v-slot="{ copyToClipboard }">
                <KPop placement="bottom">
                  <KButton
                    class="copy-button"
                    appearance="primary"
                    size="small"
                    @click="() => {
                      copyToClipboard(yamlContent.kubernetes)
                    }"
                  >
                    Copy Kubernetes YAML
                  </KButton>
                  <div slot="content">
                    <p>Entity copied to clipboard!</p>
                  </div>
                </KPop>
              </KClipboardProvider>
              <prism
                class="code-block"
                language="yaml"
                :code="yamlContent.kubernetes"
              />
            </template>
          </KTabs>
        </template>
      </KCard>
    </div>

    <div v-if="loaders === true">
      <!-- loading state -->
      <KEmptyState
        v-if="isLoading"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              icon="spinner"
              color="rgba(0, 0, 0, 0.1)"
              size="42"
            />
          </div>
          Data Loading...
        </template>
      </KEmptyState>

      <!-- no data to load -->
      <KEmptyState
        v-if="isEmpty && !isLoading"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              class="kong-icon--centered"
              color="var(--yellow-200)"
              icon="warning"
              size="42"
            />
          </div>
          There is no data to display.
        </template>
      </KEmptyState>

      <!-- error -->
      <KEmptyState
        v-if="hasError"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              class="kong-icon--centered"
              color="var(--yellow-200)"
              icon="warning"
              size="42"
            />
          </div>
          An error has occurred while trying to load this data.
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import json2yaml from '@appscode/json2yaml'

export default {
  name: 'YamlView',
  components: {
    prism: Prism
  },
  props: {
    title: {
      type: String,
      default: null
    },
    content: {
      type: Object,
      default: null
    },
    loaders: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tabs: [
        {
          hash: '#universal',
          title: 'Universal'
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      environment: 'getEnvironment'
    }),
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    activeTab: {
      get () {
        const env = this.environment

        return {
          hash: `#${env}`,
          nohash: env
        }
      },
      set (newTab) {
        return {
          hash: `#${newTab}`,
          nohash: newTab
        }
      }
    },
    yamlContent () {
      const content = this.content

      const kubernetes = () => {
        const newObj = {}
        const sourceObj = Object.assign({}, this.content)
        const { name, mesh, type } = sourceObj

        // all other parts of the Kubernetes object have to be placed under `spec`
        const spec = () => {
          const src = Object.assign({}, this.content)

          // remove the `type`, `mesh` and `name` because we don't need them here
          delete src.type
          delete src.mesh
          delete src.name

          // only return something if there are additional values
          if (src && Object.entries(src).length > 0) {
            return src
          }

          return false
        }

        // assemble the main part of our object
        newObj.apiVersion = 'kuma.io/v1alpha1'
        newObj.kind = type
        if (mesh !== undefined) { // mesh is not defined on global scoped objects
          newObj.mesh = sourceObj.mesh
        }

        if (name.includes('.')) { // if name from Kuma has '.' it means it's k8s name joined with a namespace by dot
          const parts = name.split('.')
          const namespace = parts.pop()
          const k8sName = parts.join('.') // on multi-zone when dataplanes from zone are synced to global the format is 'name.<zone-ns>.<global-ns>' so the name is `name.<remote-ns>`

          newObj.metadata = {
            name: k8sName,
            namespace: namespace
          }
        } else {
          newObj.metadata = {
            name: name
          }
        }

        // if there are additional values, place them under `spec` accordingly
        if (spec()) {
          newObj.spec = spec()
        }

        return newObj
      }

      const items = {
        universal: json2yaml(content),
        kubernetes: json2yaml(kubernetes())
      }

      return items
    }
  }
}
</script>

<style>
.yaml-view-content .k-tabs .tab-container {
  position: relative !important;
}
</style>

<style lang="scss" scoped>
.code-block {
  border-radius: 3px;
  background-color: rgba(150, 58, 133, 0.05);
  font-size: var(--type-sm);
}

.empty-state-title {

  .card-icon {
    text-align: center;

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.copy-button {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  display: block;
  margin: 0 0 var(--spacing-md) auto;

  &:after {
    display: none;
  }
}

.env-name {
  text-transform: capitalize;
}
</style>
