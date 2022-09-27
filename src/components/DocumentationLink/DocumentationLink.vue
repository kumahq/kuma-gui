<template>
  <KButton
    class="docs-link"
    appearance="outline"
    target="_blank"
    :to="href"
  >
    <template #icon>
      <KIcon icon="externalLink" />
    </template>
    Documentation
  </KButton>
</template>

<script lang="ts" setup>
defineProps({
  href: {
    type: String,
    required: true,
  },
})
</script>
