<template>
  <div
    class="component-frame"
    :class="{ 'p-4': padded }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FrameSkeleton',
  props: {
    padded: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.component-frame {
  border: 1px solid var(--gray-4);
  border-radius: 3px;
}
</style>
