<template>
  <span class="tag-list">
    <span
      v-for="(tag, index) in props.tags"
      :key="index"
      class="tag"
    >
      <span
        class="tag__label"
        :class="{
          'tag__label--is-kuma-io-label': tag.label.toLowerCase().includes('kuma.io/'),
        }"
      >
        {{ tag.label }}
      </span>

      <span class="tag__value">
        {{ tag.value }}
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import { LabelValue } from '@/types/index.d'

const props = defineProps({
  tags: {
    type: Object as PropType<LabelValue[]>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
$border-radius: 5px;

.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
}

.tag {
  display: inline-flex;
  align-items: stretch;
  font-size: var(--type-xs);
  border-radius: $border-radius;
}

.tag__label,
.tag__value {
  border: 1px solid transparent;
  padding: 0.1em 0.5em;
}

.tag__label {
  border-right: none;
  border-top-left-radius: $border-radius;
  border-bottom-left-radius: $border-radius;
  color: #fff;
  background-color: var(--blue-1);
}

.tag__label--is-kuma-io-label {
  background-color: var(--brand-color-6);
}

.tag__value {
  border-color: var(--grey-400);
  border-left: none;
  border-top-right-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  background-color: var(--white);
}
</style>
