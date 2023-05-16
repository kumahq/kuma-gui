<template>
  <div class="copy-button-wrapper">
    <component :is="props.tag">
      {{ props.text }}
    </component>

    <!-- Prevents the event’s default action which avoids unintentionally activating links _containing_ `TextWithCopyButton` by clicking the copy button. -->
    <CopyButton
      :text="props.text"
      click.prevent
    />
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
