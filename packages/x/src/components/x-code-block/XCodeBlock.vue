<template>
  <XLayout type="stack">
    <template v-if="slots['primary-actions']">
      <XLayout
        type="separated"
        justify="end"
      >
        <slot name="primary-actions" />
      </XLayout>
    </template>
    <component
      :is="props.editable ? ReadWrite : ReadOnly"
      :id="id"
      :max-height="props.maxHeight"
      :code="props.code"
      :language="props.language"
      :initial-filter-mode="props.isFilterMode"
      :initial-reg-exp-mode="props.isRegExpMode"
      :processing="processing"
      :searchable="isSearchable"
      :show-copy-button="showCopyButton"
      :query="props.query"
      theme="dark"
      @code-block-render="handleCodeBlockRenderEvent"
      @query-change="emit('query-change', $event)"
      @filter-mode-change="emit('filter-mode-change', $event)"
      @reg-exp-mode-change="emit('reg-exp-mode-change', $event)"
      @input="emit('input', $event)"
    >
      <template
        v-if="slots['secondary-actions']"
        #secondary-actions
      >
        <slot name="secondary-actions" />
      </template>
    </component>
  </XLayout>
</template>

<script lang="ts" setup>
import { ref, useId } from 'vue'

import {
  useSyntaxHighlighter,
  useReadOnlyCodeBlock,
  useReadWriteCodeBlock,
} from '@kumahq/x'

const props = withDefaults(defineProps<{
  editable?: boolean
  id?: string
  code: string
  language: 'json' | 'yaml' | 'bash'
  isSearchable?: boolean
  showCopyButton?: boolean
  maxHeight?: string
  query?: string
  isFilterMode?: boolean
  isRegExpMode?: boolean
}>(), {
  editable: true,
  id: () => `x-code-block-${useId()}`,
  isSearchable: false,
  showCopyButton: true,
  maxHeight: undefined,
  query: '',
  isFilterMode: false,
  isRegExpMode: false,
})
const slots = defineSlots()

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
  (event: 'input', content: string): void
}>()

const syntax = useSyntaxHighlighter()
const ReadOnly = useReadOnlyCodeBlock()
const ReadWrite = useReadWriteCodeBlock()

const processing = ref(false)

async function handleCodeBlockRenderEvent({ codeElement, code }: { codeElement: HTMLElement, code: string }): Promise<void> {
  processing.value = true
  // we can ignore eslint no-unsanitized/property as all code content is stringified and shiki adds safe HTML for highlighting.
  // eslint-disable-next-line no-unsanitized/property
  codeElement.innerHTML = (await syntax()).codeToHtml(code, {
    lang: props.language,
    themes: {
      light: 'catppuccin-mocha', // both dark for now at least
      dark: 'catppuccin-mocha',
    },
  })
  processing.value = false
}
</script>
<style lang="scss">
// Shiki code blocks; dark theme: https://shiki.style/guide/dual-themes#class-based-dark-mode
html.dark,
.theme-dark {
  .shiki,
  .shiki span {
    background-color: unset !important;
    color: var(--shiki-dark) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
</style>

<style lang="scss" scoped>
// Makes code block actions sticky
:deep(.code-block-actions) {
  position: sticky;
  z-index: 4;
  top: var(--app-view-content-top, var(--AppHeaderHeight, 0));
  background-color: $kui-color-background-inverse;
}

:deep(.highlighted-code-block) {
  overflow: hidden !important;
}
</style>
