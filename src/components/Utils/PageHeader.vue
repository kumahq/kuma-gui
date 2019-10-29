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
  props: {
    noflex: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
