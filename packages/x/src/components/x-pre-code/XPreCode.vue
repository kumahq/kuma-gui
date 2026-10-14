<template>
  <XCodeBlock
    :code="props.code"
    :language="language"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue'

import XCodeBlock from '../x-code-block/XCodeBlock.vue'

type TXCodeBlock = InstanceType<typeof XCodeBlock>
type Language = TXCodeBlock['$props']['language']

const props = withDefaults(defineProps<{
  code?: string
  language?: Language
}>(), {
  code: '',
  language: 'bash',
})

const language = computed(() => ((['json', 'yaml', 'bash'] as const).includes(props.language) ? props.language : 'bash'))
</script>
