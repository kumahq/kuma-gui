<template>
  <header
    class="page-header"
    :class="{ 'flex justify-between items-center my-6' : !noflex }"
  >
    <slot />
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    noflex: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.page-header {
  margin-bottom: 30px;
}
</style>
