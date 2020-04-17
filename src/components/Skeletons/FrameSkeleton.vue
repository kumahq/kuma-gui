<template>
  <div class="component-frame">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FrameSkeleton'
}
</script>

<style lang="scss" scoped>
.component-frame {
  border: 1px solid var(--gray-4);
  border-radius: 3px;
}
</style>
