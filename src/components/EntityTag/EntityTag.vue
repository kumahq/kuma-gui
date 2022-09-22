<template>
  <span class="entity-tag">
    <span
      class="entity-tag__label"
      :class="{ 'entity-tag__label--is-kuma-io-label': isKumaIoLabel }"
    >
      {{ tag.label }}
    </span>

    <span class="entity-tag__value">
      {{ tag.value }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import { LabelValue } from '@/types'

const props = defineProps({
  tag: {
    type: Object as PropType<LabelValue>,
    required: true,
  },
})

const isKumaIoLabel = computed(() => props.tag.label.toLowerCase().includes('kuma.io/'))
</script>

<style lang="scss" scoped>
$border-radius: 5px;

.entity-tag {
  display: inline-flex;
  align-items: stretch;
  font-size: var(--type-xs);
  border-radius: $border-radius;
}

.entity-tag__label,
.entity-tag__value {
  border: 1px solid transparent;
  padding: 0.1em 0.5em;
}

.entity-tag__label {
  border-right: none;
  border-top-left-radius: $border-radius;
  border-bottom-left-radius: $border-radius;
  color: #fff;
  background-color: var(--blue-1);
}

.entity-tag__label--is-kuma-io-label {
  background-color: var(--brand-color-6);
}

.entity-tag__value {
  border-color: var(--grey-400);
  border-left: none;
  border-top-right-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  background-color: var(--white);
}
</style>
