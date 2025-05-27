<template>
  <KModal
    :visible="true"
    @cancel="() => emit('cancel')"
  >
    <template
      v-for="(_, key) in slots"
      :key="key"
      #[`${key}`]
    >
      <slot
        :close="() => emit('cancel')"
        :name="key"
      />
    </template>
  </KModal>
</template>
<script lang="ts" setup>
import { KModal } from '@kong/kongponents'
const slots = defineSlots<{
  default(props: {
    close: () => void
  }): any
  ['footer-actions'](props: {
    close: () => void
  }): any
}>()
const emit = defineEmits<{
  (event: 'cancel'): void
}>()
</script>
