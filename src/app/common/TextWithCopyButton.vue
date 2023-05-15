<template>
  <div class="copy-button-wrapper">
    <component :is="props.tag">
      {{ props.text }}
    </component>

    <CopyButton :text="props.text" />
  </div>
</template>

<script lang="ts" setup>
import CopyButton from './CopyButton.vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    required: false,
    default: 'span',
  },
})
</script>

<style lang="scss" scoped>
.copy-button-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
