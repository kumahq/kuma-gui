<template>
  <KModal
    :visible="true"
  >
    <template
      v-for="(_, key) in slots"
      :key="key"
      #[`${key}`]
    >
      <slot
        :name="key"
      />
    </template>
  </KModal>
</template>
<script lang="ts" setup>
import { KModal } from '@kong/kongponents'
const slots = defineSlots()
</script>
