<template>
  <KRadio
    v-model="model"
    :class="{
      'variant-card': props.card,
    }"
    v-bind="attrs"
    :card="props.card"
    :selected-value="props.selectedValue"
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

<script lang="ts" setup>
import { KRadio } from '@kong/kongponents'
import { useAttrs } from 'vue'

import type { RadioModelValue } from '@kong/kongponents'


const model = defineModel<RadioModelValue>({ required: true })
const props = withDefaults(defineProps<{
  selectedValue: RadioModelValue
  card?: boolean
}>(), {
  card: false,
})
const slots = defineSlots()
const attrs = useAttrs()


</script>
<style lang="scss" scoped>
.variant-card {
  :not(.checked) :deep(.card-content-wrapper) {
    color: var(--x-color-text) !important;
  }

  :deep(.card-content-wrapper) {
    & {
      font-family: var(--x-font-family-text);
      font-size: var(--x-font-size-30);
      font-weight: var(--x-font-weight-semibold);
      line-height: var(--x-line-height-30);
    }

    header {
      margin-bottom: var(--x-space-20);
    }

    p {
      color: var(--x-color-text-neutral);
      font-family: var(--x-font-family-text);
      font-size: var(--x-font-size-20);
      font-weight: var(--x-font-weight-regular);
      line-height: var(--x-line-height-20);
    }
  }
}
</style>
