<template>
  <div class="code-view">
    <div
      v-if="isReady"
      class="code-view-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
        border-variant="noBorder"
      >
        <template v-slot:body>
          <Prism
            class="code-block"
            :language="lang"
            :code="codeContent"
          />
        </template>
        <template v-slot:actions>
          <KClipboardProvider
            v-if="content"
            v-slot="{ copyToClipboard }"
          >
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="() => { copyToClipboard(codeContent) }"
              >
                {{ copyButtonText }}
              </KButton>
              <template v-slot:content>
                <div>
                  <p>Entity copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>
    </div>

    <div v-if="loaders === true">
      <!-- loading state -->
      <KEmptyState
        v-if="isLoading"
        cta-is-hidden
      >
        <template v-slot:title>
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
        <template v-slot:title>
          <div class="card-icon mb-3">
            <KIcon
              class="kong-icon--centered"
              color="var(--yellow-200)"
              icon="warning"
              secondary-color="var(--black-75)"
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
        <template v-slot:title>
          <div class="card-icon mb-3">
            <KIcon
              class="kong-icon--centered"
              color="var(--yellow-200)"
              icon="warning"
              secondary-color="var(--black-75)"
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
import Prism from 'vue-prismjs'

export default {
  name: 'CodeView',
  components: {
    Prism,
  },
  props: {
    lang: {
      type: String,
      required: true,
    },
    copyButtonText: {
      type: String,
      default: 'Copy to Clipboard',
    },
    title: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
    loaders: {
      type: Boolean,
      default: true,
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
  computed: {
    isReady() {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    codeContent() {
      const content = this.content

      return content
    },
  },
}
</script>

<style lang="scss" scoped>
.code-block {
  border-radius: 3px;
  background-color:  var(--code-background);
  font-size: var(--type-sm);
}

.empty-state-title {
  .card-icon {
    text-align: center;

    img,
    svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
