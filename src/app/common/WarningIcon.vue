<template>
  <KIcon
    icon="warning"
    color="#0b172d"
    secondary-color="#ffd68c"
    :size="props.size"
    :hide-title="props.hideTitle"
  />
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'

const props = withDefaults(defineProps<{
  size?: string
  hideTitle?: boolean
}>(), {
  size: '64',
  hideTitle: false,
})
</script>
