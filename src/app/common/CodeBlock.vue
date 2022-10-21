<template>
  <KCodeBlock
    :id="id"
    class="code-block"
    :style="props.codeMaxHeight ? `--KCodeBlockMaxHeight: ${props.codeMaxHeight}` : undefined"
    :code="reformattedCode"
    :language="language"
    :is-processing="isProcessing"
    :is-searchable="isSearchable"
    :query="query"
    @code-block-render="handleCodeBlockRenderEvent"
    @query-change="updateStoredQuery"
  />
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from 'vue'
import { KCodeBlock } from '@kong/kongponents'
import { CodeBlockEventData } from '@kong/kongponents/dist/types/components/KCodeBlock/KCodeBlock.vue.d'

import { highlightElement, AvailableLanguages } from '@/utils/highlightElement'
import { ClientStorage } from '@/utils/ClientStorage'
import { reformatYaml } from '@/utils/reformatYaml'

const props = defineProps({
  /**
   * ID value used for form elements like the search input and its label.
   */
  id: {
    type: String,
    required: true,
  },

  /**
   * The code that will be rendered as a text node inside of a `<pre><code></code></pre>` fragment.
   */
  code: {
    type: String,
    required: true,
  },

  /**
   * The syntax language of `props.code` (e.g. `'json'`).
   */
  language: {
    type: String as PropType<AvailableLanguages>,
    required: true,
  },

  /**
   * Shows an actions bar with a search input and related action buttons.
   */
  isSearchable: {
    type: Boolean,
    required: false,
    default: false,
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

function handleCodeBlockRenderEvent({ preElement, codeElement, language, code }: CodeBlockEventData): void {
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

.k-code-block-actions {
  position: sticky;
  z-index: 4;
  top: var(--topbar-height);
}
</style>
