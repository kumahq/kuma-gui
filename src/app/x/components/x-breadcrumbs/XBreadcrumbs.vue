<template>
  <KBreadcrumbs
    :items="props.items"
    :item-max-width="'500px'"
  >
    <template
      v-for="(slot, key) in slots"
      :key="key"
      #[`${key}`]
    >
      <slot
        :name="key"
      />
    </template>
  </KBreadcrumbs>
</template>
<script lang="ts" setup>
import { KBreadcrumbs } from '@kong/kongponents'
import { useSlots } from 'vue'

import type { BreadcrumbItem } from '@kong/kongponents'

const slots = useSlots()
const props = defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
