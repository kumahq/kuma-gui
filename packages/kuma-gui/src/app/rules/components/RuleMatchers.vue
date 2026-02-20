<template>
  <template
    v-for="({ key, value, not }, i) in props.items"
    :key="i"
  >
    <span class="rule-matchers"><span
      v-if="i > 0"
      class="and"
    > and<br></span><abbr
      v-if="not"
      class="not"
      title="not"
    >!</abbr><span
      class="term"
    >{{ `${key}:${value}` }}</span></span>
  </template>
</template>
<script lang="ts" setup>
import type { InspectRuleMatcher } from '@/types/index.d'
const props = defineProps<{
  items: InspectRuleMatcher[]
}>()
</script>
<style lang="scss" scoped>
.rule-matchers {
  font-weight: var(--x-font-weight-regular);
}
abbr {
  text-decoration: none;
}
.not {
  color: var(--x-color-text-danger);
}

.and {
  font-weight: var(--x-font-weight-semibold);
}

.not,
.term {
  font-family: var(--x-font-family-code);
}

</style>
