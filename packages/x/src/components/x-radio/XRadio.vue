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
}
</style>
