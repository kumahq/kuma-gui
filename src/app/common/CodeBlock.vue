<template>
  <KCodeBlock
    :id="id"
    class="code-block"
    :style="props.codeMaxHeight ? `--KCodeBlockMaxHeight: ${props.codeMaxHeight}` : undefined"
    :code="reformattedCode"
    :language="language"
    :is-processing="isProcessing"
    :is-searchable="isSearchable"
    :show-copy-button="showCopyButton"
    :query="query"
    @code-block-render="handleCodeBlockRenderEvent"
    @query-change="updateStoredQuery"
  />
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from 'vue'
import { KCodeBlock } from '@kong/kongponents'
import { CodeBlockEventData } from '@kong/kongponents/dist/types/components/KCodeBlock/KCodeBlock.vue.d'

import { highlightElement, AvailableLanguages } from '@/utilities/highlightElement'
import { ClientStorage } from '@/utilities/ClientStorage'
import { reformatYaml } from '@/utilities/reformatYaml'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  language: {
    type: String as PropType<AvailableLanguages>,
    required: true,
  },

  isSearchable: {
    type: Boolean,
    required: false,
    default: false,
  },

  showCopyButton: {
    type: Boolean,
    required: false,
    default: true,
  },

  queryKey: {
    type: String,
    required: false,
    default: null,
  },

  codeMaxHeight: {
    type: String,
    required: false,
    default: null,
  },
})

const query = getStoredQuery()

const isProcessing = ref(false)

const reformattedCode = computed(() => props.language === 'yaml' ? reformatYaml(props.code) : props.code)

async function handleCodeBlockRenderEvent({ preElement, codeElement, language, code }: CodeBlockEventData): Promise<void> {
  isProcessing.value = true

  highlightElement(preElement, codeElement, code, language as AvailableLanguages)

  isProcessing.value = false
}

function getStoredQuery(): string {
  const queries = ClientStorage.get('codeBlockQueries')
  const queryKey = props.queryKey ?? props.id

  return queries?.[queryKey] ? queries[queryKey] : ''
}

function updateStoredQuery(queryValue: string): void {
  const queries = ClientStorage.get('codeBlockQueries') ?? {}
  const queryKey = props.queryKey ?? props.id

  if (queryValue === '') {
    delete queries[queryKey]
  } else {
    queries[queryKey] = queryValue
  }

  ClientStorage.set('codeBlockQueries', queries)
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
</style>
