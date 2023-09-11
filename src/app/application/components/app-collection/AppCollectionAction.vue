<template>
  <KDropdownItem
    v-bind="props"
  />
</template>
<script lang="ts" setup>
import {
  KDropdownItem,
} from '@kong/kongponents'

import type { DropdownItem } from '@kong/kongponents'
import type { PropType } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<DropdownItem>,
    default: null,
    validator: (item: DropdownItem) => item.label !== undefined,
  },
  hasDivider: {
    type: Boolean,
    default: false,
  },
  isDangerous: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>
