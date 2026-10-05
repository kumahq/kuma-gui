<template>
  <XCodeBlock
    :code="code"
    :language="language"
  />
</template>
<script lang="ts" setup>
import { computed, useHost, useShadowRoot } from 'vue'

import XCodeBlock from '../x-code-block/XCodeBlock.vue'
import { adoptDocumentStyleSheets } from '../../utilities/adoptDocumentStylesheets'

type TXCodeBlock = InstanceType<typeof XCodeBlock>
type Language = TXCodeBlock['$props']['language']

const props = withDefaults(defineProps<{
  code?: string
  language?: Language
}>(), {
  code: undefined,
  language: 'bash',
})

const host = useHost()
const code = computed(() => props.code ?? host?.textContent ?? '')

const language = computed(() => ((['json', 'yaml', 'bash'] as const).includes(props.language) ? props.language : 'bash'))

const shadowRoot = useShadowRoot()
if (shadowRoot !== null) {
  adoptDocumentStyleSheets(shadowRoot)
}
</script>
