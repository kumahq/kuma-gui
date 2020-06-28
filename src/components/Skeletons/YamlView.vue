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
                    @click="() => { copyToClipboard(yamlContent.universal) }"
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
                    @click="() => { copyToClipboard(yamlContent.kubernetes) }"
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
              color="var(--yellow-base)"
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
              color="var(--yellow-base)"
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
      get (test) {
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
        const { name, type } = sourceObj

        delete sourceObj.type
        delete sourceObj.name

        newObj.apiVersion = 'kuma.io/v1alpha1'
        newObj.kind = type
        newObj.metadata = {
          name: name
        }

        return { ...newObj, ...sourceObj }
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
