<template>
  <div class="stat">
    <header class="stat__title">
      <slot name="title"></slot>
    </header>
    <div class="stat__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.stat {
}

.stat__title {
}

.stat__content {
}
</style>
