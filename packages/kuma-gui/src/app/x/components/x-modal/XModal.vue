<template>
  <KModal
    :visible="true"
  >
    <template
      v-for="(_, key) in slots"
      :key="key"
      #[`${key}`]
    >
      <slot :name="key" />
    </template>
  </KModal>
</template>
<script lang="ts" setup>
import { KModal } from '@kong/kongponents'
import { useSlots } from 'vue'
const slots = useSlots()
</script>
