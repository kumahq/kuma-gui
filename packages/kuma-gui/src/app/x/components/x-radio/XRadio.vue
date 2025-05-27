<template>
  <KRadio
    v-bind="attrs"
    v-model="model"
    :card="props.card"
    :card-radio-visible="false"
    :selected-value="props.value"
    @change="change"
  >
    <template
      v-for="(_, slotName) in slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="(slotProps)"
      />
    </template>
  </KRadio>
</template>

<script setup lang="ts">
import { KRadio } from '@kong/kongponents'
import { useAttrs, inject, ref } from 'vue'

const slots = defineSlots()
const attrs = useAttrs()
const props = withDefaults(defineProps<{
  card?: boolean
  value?: string
}>(), {
  card: false,
  value: '',
})
const model = ref()
const select = inject<{
  emit: (name: string, e: string) => void
}>('x-select')

const change = (e: string) => {
  if(select) {
    select.emit('change', e)
  }
}
</script>

<style lang="scss" scoped>
.k-radio:not(.checked) :deep(.card-content-wrapper) {
  color: $kui-color-text !important;
}
:deep(.card-content-wrapper) {
  & {
    font-family: $kui-font-family-text;
    font-size: $kui-font-size-30;
    font-weight: $kui-font-weight-semibold;
    line-height: $kui-line-height-30;
  }
  header {
    margin-bottom: $kui-space-20;
  }
  p {
    color: $kui-color-text-neutral;
    font-family: $kui-font-family-text;
    font-size: $kui-font-size-20;
    font-weight: $kui-font-weight-regular;
    line-height: $kui-line-height-20;
  }
}
</style>
