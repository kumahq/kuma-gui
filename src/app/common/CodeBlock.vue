<template>
  <KCodeBlock
    :id="id"
    class="code-block"
    :max-height="props.codeMaxHeight"
    :code="props.code"
    :language="language"
    :initial-filter-mode="props.isFilterMode"
    :initial-reg-exp-mode="props.isRegExpMode"
    :is-processing="isProcessing"
    :is-searchable="isSearchable"
    :show-copy-button="showCopyButton"
    :query="props.query"
    theme="dark"
    @code-block-render="handleCodeBlockRenderEvent"
    @query-change="emit('query-change', $event)"
    @filter-mode-change="emit('filter-mode-change', $event)"
    @reg-exp-mode-change="emit('reg-exp-mode-change', $event)"
  >
    <template
      v-if="$slots['secondary-actions']"
      #secondary-actions
    >
      <slot name="secondary-actions" />
    </template>
  </KCodeBlock>
</template>

<script lang="ts" setup>
import { type CodeBlockEventData, KCodeBlock } from '@kong/kongponents'
import { ref } from 'vue'

import { highlightElement, type AvailableLanguages } from '@/utilities/highlightElement'
import uniqueId from '@/utilities/uniqueId'

const props = withDefaults(defineProps<{
  id?: string
  code: string
  language: AvailableLanguages
  isSearchable?: boolean
  showCopyButton?: boolean
  codeMaxHeight?: string
  query?: string
  isFilterMode?: boolean
  isRegExpMode?: boolean
}>(), {
  id: () => uniqueId('code-block'),
  isSearchable: false,
  showCopyButton: true,
  codeMaxHeight: undefined,
  query: '',
  isFilterMode: false,
  isRegExpMode: false,
})

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
}>()

const isProcessing = ref(false)

async function handleCodeBlockRenderEvent({ preElement, codeElement, language, code }: CodeBlockEventData): Promise<void> {
  isProcessing.value = true

  const escapedCode = code
    // Replaces all “<” and “>” characters with their HTML entities because PrismJS needs that.
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
  highlightElement(preElement, codeElement, escapedCode, language as AvailableLanguages)

  isProcessing.value = false
}
</script>

<style lang="scss">
.code-block code {
  // DO NOT REMOVE OR OVERRIDE THIS.
  // Believe it or not, this avoids a critical performance issue with highlighting code and specifically highlighting lines using Prism’s line-highlight plugin.
  // https://github.com/PrismJS/prism/issues/2062
  display: block !important;
}

// Makes code block actions sticky
.code-block .k-code-block-actions {
  position: sticky;
  z-index: 4;
  top: var(--AppHeaderHeight);
}

.code-block .k-highlighted-code-block {
  border: none;
}
</style>
