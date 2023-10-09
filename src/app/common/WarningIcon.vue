<template>
  <WarningIcon
    color="var(--WarningIconBackground, currentColor)"
    display="inline-block"
    :size="props.size || KUI_ICON_SIZE_60"
    :hide-title="props.hideTitle"
  />
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_60 } from '@kong/design-tokens'
import { WarningIcon } from '@kong/icons'

const props = withDefaults(defineProps<{
  size?: string
  hideTitle?: boolean
}>(), {
  size: '',
  hideTitle: false,
})
</script>
