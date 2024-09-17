<template>
  <KInput
    :model-value="props.value"
    @input="(e: string) => e.length === 0 ? emit('change', e) : change(e)"
  >
    <template
      v-if="[
        'search',
      ].includes(props.appearance)"
      #before
    >
      <XIcon
        name="search"
      />
    </template>
  </KInput>
</template>
<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: string
  appearance?: '' | 'search'
  debounce?: number
}>(), {
  value: '',
  appearance: '',
  debounce: 0,
})

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const _change = (e: string) => emit('change', e)
const change = computed(() => {
  return props.debounce > 0
    ? useDebounceFn((e) => {
      _change(e)
    }, props.debounce)
    : _change
})
</script>
<style lang="scss" scoped>
:deep(.input-element-wrapper) {
  position: relative;
  z-index: 1;
}
:deep(.x-icon-search-icon) {
  color: $kui-color-text-primary !important;
}
</style>
