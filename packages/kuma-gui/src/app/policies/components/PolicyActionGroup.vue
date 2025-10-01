<template>
  <XActionGroup
    v-bind="attrs"
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
  </XActionGroup>
</template>
<script lang="ts" generic="T extends { name: string } | undefined" setup>
import { useAttrs } from 'vue'
const slots = defineSlots()
const attrs = useAttrs()
const _props = withDefaults(defineProps<{
  item?: T
  type?: unknown
}>(), {
  item: undefined,
  type: undefined,
})
</script>
