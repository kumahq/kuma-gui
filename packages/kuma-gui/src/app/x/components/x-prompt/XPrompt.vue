<template>
  <KPrompt
    :action-button-text="props.action"
    :action-button-appearance="props.type === 'danger' ? 'danger' : 'primary'"
    :confirmation-text="props.expected.length > 0 ? props.expected : undefined"
    :visible="true"
    @cancel="() => emit('cancel')"
    @proceed="() => emit('submit')"
  >
    <template
      #title
    >
      <slot
        name="title"
      />
    </template>

    <slot
      name="default"
    />
  </KPrompt>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, provide } from 'vue'
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
onBeforeUnmount(() => {
  document?.body?.classList?.remove('k-modal-overflow-hidden')
})
</script>
<style lang="scss">
.error {
  margin-top: $kui-space-60;
}
</style>
