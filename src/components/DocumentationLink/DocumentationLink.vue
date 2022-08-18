<template>
  <KButton
    class="docs-link"
    appearance="outline"
    size="small"
    target="_blank"
    :to="href"
  >
    <template #icon>
      <KIcon icon="externalLink" />
    </template>
    Documentation
  </KButton>
</template>

<script>
export default {
  name: 'DocumentationLink',
  props: {
    href: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.docs-link {
  cursor: pointer;
  position: absolute;

  top: -48px;
  right: -4px;
}
</style>
