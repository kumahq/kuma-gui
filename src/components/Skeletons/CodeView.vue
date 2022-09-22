<template>
  <div class="code-view">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock v-else-if="hasError" />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="code-view-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
        border-variant="noBorder"
      >
        <template #body>
          <CodeBlock
            :language="lang"
            :code="content"
          />
        </template>
        <template #actions>
          <KClipboardProvider
            v-if="content"
            v-slot="{ copyToClipboard }"
          >
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="() => { copyToClipboard(content) }"
              >
                {{ copyButtonText }}
              </KButton>

              <template #content>
                <div>
                  <p>Entity copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>
    </div>
  </div>
</template>

<script>
import { KButton, KCard, KClipboardProvider, KPop } from '@kong/kongponents'

import CodeBlock from '../CodeBlock.vue'
import EmptyBlock from '../EmptyBlock.vue'
import ErrorBlock from '../ErrorBlock.vue'
import LoadingBlock from '../LoadingBlock.vue'

export default {
  name: 'CodeView',

  components: {
    CodeBlock,
    EmptyBlock,
    ErrorBlock,
    LoadingBlock,
    KButton,
    KCard,
    KClipboardProvider,
    KPop,
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
}
</script>

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
</style>
