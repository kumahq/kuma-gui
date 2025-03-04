<template>
  <XLayout
    type="stack"
  >
    <template
      v-if="slots['primary-actions']"
    >
      <XLayout
        type="separated"
        justify="end"
      >
        <slot name="primary-actions" />
      </XLayout>
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
        v-if="slots['secondary-actions']"
        #secondary-actions
      >
        <slot name="secondary-actions" />
      </template>
    </KCodeBlock>
  </XLayout>
</template>

<script lang="ts" setup>
import { type CodeBlockEventData, KCodeBlock } from '@kong/kongponents'
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'
import { ref } from 'vue'

import { uniqueId } from '@/app/application'

const props = withDefaults(defineProps<{
  id?: string
  code: string
  language: 'json' | 'yaml' | 'bash'
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
const slots = defineSlots()

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
}>()

const isProcessing = ref(false)

async function handleCodeBlockRenderEvent({ codeElement, language, code }: CodeBlockEventData): Promise<void> {
  isProcessing.value = true

  // TODO(@schogges): use createJavascriptRawEngine for further optimization of bundle size (requires pre-compiled langs)
  const engine = createJavaScriptRegexEngine()

  const highlighter = await createHighlighterCore({
    langs: [
      import('shiki/langs/json.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/bash.mjs'),
    ],
    themes: [
      import('shiki/themes/material-theme-palenight.mjs'),
    ],
    engine,
  })

  const highlighted = highlighter.codeToHtml(code, {
    theme: 'material-theme-palenight',
    lang: language,
  })

  // we can ignore eslint no-unsanitized/property as all code content is stringified and shiki adds safe HTML for highlighting.
  // eslint-disable-next-line no-unsanitized/property
  codeElement.innerHTML = highlighted

  isProcessing.value = false
}
</script>

<style lang="scss" scoped>
// Makes code block actions sticky
:deep(.code-block-actions) {
  position: sticky;
  z-index: 4;
  top: var(--app-view-content-top, var(--AppHeaderHeight, 0));
  background-color: $kui-color-background-inverse;
}
:deep(.shiki) {
  background-color: unset !important;
}
</style>
