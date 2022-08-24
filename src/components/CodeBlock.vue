<template>
  <pre
    class="code-block"
    :class="`language-${language}`"
    data-testid="code-block"
  ><code v-html="highlightedCode" /></pre>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { highlightCode } from '@/utils/highlight-code';

const props = defineProps<{
  language: string
  code: string
}>()

const highlightedCode = computed(() => highlightCode(props.code, props.language))
</script>

<style lang="scss" scoped>
.code-block {
  border-radius: 3px;
  background-color:  var(--code-background);
  font-size: var(--type-sm);
}
</style>
