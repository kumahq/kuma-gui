<template>
  <KPrompt
    :action-button-text="props.action"
    :confirmation-text="props.expected.length > 0 ? props.expected : undefined"
    :visible="true"
    :type="props.type"
    @cancel="() => emit('cancel')"
    @proceed="() => emit('submit')"
  >
    <template
      #title
    >
      <slot name="title" />
    </template>

    <slot name="default" />
  </KPrompt>
</template>
<script lang="ts" setup>
import { provide } from 'vue'
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()
const props = withDefaults(defineProps<{
  type?: 'danger'
  expected?: string
  action: string
}>(), {
  type: 'danger',
  expected: '',
})
provide('x-prompt', {})
</script>
<style lang="scss">
.error {
  margin-top: $kui-space-60;
}
</style>
