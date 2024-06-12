<template>
  <div>
    <template
      v-if="$slots['primary-actions']"
    >
      <div
        class="toolbar"
      >
        <slot name="primary-actions" />
      </div>
    </template>
    <KCodeBlock
      :id="id"
      :max-height="props.codeMaxHeight"
      :code="props.code"
      :language="language"
      :initial-filter-mode="props.isFilterMode"
      :initial-reg-exp-mode="props.isRegExpMode"
      :processing="isProcessing"
      :searchable="isSearchable"
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
  </div>
</template>

<script lang="ts" setup>
import { type CodeBlockEventData, KCodeBlock } from '@kong/kongponents'
import { ref } from 'vue'

import { highlightElement, type AvailableLanguages } from './highlightElement'
import { uniqueId } from '@/app/application'

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

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $kui-space-60;
  margin-bottom: $kui-space-60;
}

// Reset some PrismJS styles that interfere with the display of the code block.
:deep(pre[class*=language-]),
:deep(code[class*=language-]) {
  background: unset !important;
  padding: unset !important;
  border: unset !important;
  border-radius: unset !important;
  box-shadow: unset !important;
  text-shadow: unset !important;
}
</style>
