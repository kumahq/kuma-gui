<template>
  <div class="yaml-view">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock v-else-if="hasError" />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="yaml-view-content"
    >
      <KTabs
        :key="environment"
        v-model="activeTab.hash"
        :tabs="tabs"
      >
        <template #universal>
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

              <template #content>
                <div>
                  <p>Entity copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>

          <CodeBlock
            language="yaml"
            :code="yamlContent.universal"
          />
        </template>

        <template #kubernetes>
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

              <template #content>
                <div>
                  <p>Entity copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>

          <CodeBlock
            language="yaml"
            :code="yamlContent.kubernetes"
          />
        </template>
      </KTabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { KButton, KClipboardProvider, KPop, KTabs } from '@kong/kongponents'
import json2yaml from '@appscode/json2yaml'

import CodeBlock from '../CodeBlock.vue'
import EmptyBlock from '../EmptyBlock.vue'
import ErrorBlock from '../ErrorBlock.vue'
import LoadingBlock from '../LoadingBlock.vue'

export default {
  name: 'YamlView',

  components: {
    CodeBlock,
    EmptyBlock,
    ErrorBlock,
    LoadingBlock,
    KButton,
    KClipboardProvider,
    KPop,
    KTabs,
  },

  props: {
    content: {
      type: Object,
      default: null,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    hasError: {
      type: Boolean,
      default: false,
    },

    isEmpty: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },

        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
    }
  },

  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
    }),

    activeTab: {
      get() {
        const env = this.environment ? this.environment : this.tabs[0].hash.substring(1)

        return {
          hash: `#${env}`,
          nohash: env,
        }
      },

      set(newTab) {
        return {
          hash: `#${newTab}`,
          nohash: newTab,
        }
      },
    },

    yamlContent() {
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
        if (mesh !== undefined) {
          // mesh is not defined on global scoped objects
          newObj.mesh = sourceObj.mesh
        }

        if (name?.includes('.')) {
          // if name from Kuma has '.' it means it's k8s name joined with a namespace by dot
          const parts = name.split('.')
          const namespace = parts.pop()
          const k8sName = parts.join('.') // on multi-zone when dataplanes from zone are synced to global the format is 'name.<zone-ns>.<global-ns>' so the name is `name.<zone-ns>`

          newObj.metadata = {
            name: k8sName,
            namespace,
          }
        } else {
          newObj.metadata = {
            name,
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
        kubernetes: json2yaml(kubernetes()),
      }

      return items
    },
  },
}
</script>

<style>
.yaml-view-content .k-tabs .tab-container {
  position: relative !important;
}
</style>

<style lang="scss" scoped>
.empty-state-title .card-icon {
  text-align: center;

  img,
  svg {
    display: block;
    margin-left: auto;
    margin-right: auto;
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
