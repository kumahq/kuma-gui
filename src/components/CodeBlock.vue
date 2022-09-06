<template>
  <!-- eslint-disable vue/no-v-html -->
  <pre
    class="code-block"
    :class="`language-${language}`"
    data-testid="code-block"
  ><code v-html="highlightedCode" /></pre>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { highlightCode } from '@/utils/highlightCode'
import { reformatYaml } from '@/utils/reformatYaml'

const props = defineProps<{
  language: string
  code: string
}>()

const highlightedCode = computed(() => {
  const reformattedCode = props.language === 'yaml' ? reformatYaml(props.code) : props.code

  return highlightCode(reformattedCode, props.language)
})
</script>

<style lang="scss" scoped>
.code-block {
  border-radius: 3px;
  background-color:  var(--code-background);
  font-size: var(--type-sm);
}
</style>
