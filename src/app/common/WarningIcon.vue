<template>
  <WarningIcon
    color="var(--WarningIconBackground, currentColor)"
    :size="props.size || KUI_ICON_SIZE_60"
  />
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_60 } from '@kong/design-tokens'
import { WarningIcon } from '@kong/icons'

const props = defineProps<{
  size?: string
}>()
</script>
