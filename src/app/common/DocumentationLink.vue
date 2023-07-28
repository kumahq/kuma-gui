<template>
  <a
    class="docs-link"
    :href="props.href"
    target="_blank"
  >
    <KIcon
      icon="book"
      color="currentColor"
      size="16"
      hide-title
    />

    <span class="visually-hidden">Documentation</span>
  </a>
</template>

<script lang="ts" setup>
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.docs-link {
  display: inline-flex;
  align-items: center;
  padding-right: var(--spacing-sm);
  padding-left: var(--spacing-sm);
}
</style>
