<template>
  <KInput
    :model-value="props.value"
    @input="(e: string) => change(e)"
  >
    <template
      v-if="[
        'search',
        'filter',
      ].includes(props.appearance)"
      #before
    >
      <XIcon
        name="search"
      />
      <slot name="before" />
    </template>

    <template
      v-for="(_, slotName) in Object.fromEntries(Object.entries(slots).filter(([key]) => !['before'].includes(key)))"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="(slotProps)"
      />
    </template>
  </KInput>
</template>
<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { computed } from 'vue'
const slots = defineSlots()

const props = withDefaults(defineProps<{
  value?: string
  appearance?: '' | 'search' | 'filter'
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
