<template>
  <XCopyButton
    format="custom"
    :text="props.text"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot name="default" />
    </template>
  </XCopyButton>
</template>

<script lang="ts" setup>
const props = defineProps<{
  text: string
}>()
</script>
