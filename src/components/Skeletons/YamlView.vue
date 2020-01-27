<template>
  <div class="yaml-view">
    <div
      v-if="isReady"
      class="yaml-view-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
      >
        <template slot="body">
          <prism
            class="code-block"
            language="yaml"
            :code="yamlContent"
          />
        </template>
        <template slot="actions">
          <KClipboardProvider
            v-if="content"
            v-slot="{ copyToClipboard }"
          >
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="() => { copyToClipboard(yamlContent) }"
              >
                Copy YAML to Clipboard
              </KButton>
              <div slot="content">
                <p>Entity copied to clipboard!</p>
              </div>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>
    </div>

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
      v-if="isEmpty"
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
</template>

<script>
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
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    yamlContent () {
      const content = this.content

      return json2yaml(content)
    }
  }
}
</script>

<style lang="scss" scoped>
.code-block {
  border-radius: 3px;
  background-color: rgba(150, 58, 133, 0.05);
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
</style>
