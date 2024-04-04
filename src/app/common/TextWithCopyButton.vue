<template>
  <div class="copy-button-wrapper">
    <span class="text"><slot>{{ props.text }}</slot></span>

    <KCopy
      format="hidden"
      :text="props.text"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  text: string
}>()
</script>

<style lang="scss" scoped>
.copy-button-wrapper {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-40;
}

.text {
  min-width: 0;
  word-wrap: break-word;
}
</style>
