<template>
  <div class="metric">
    <header class="metric__title">
      <slot name="title"></slot>
    </header>
    <div class="metric__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.metric {
  background-color: var(--gray-1);
  border-left: 2px solid var(--gray-2);
  padding: 1.35rem;
}

.metric__title {
  font-size: 16px;
  color: var(--gray-3);
  margin-bottom: 14px;
}

.metric__content {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.75);
  letter-spacing: -0.25px;
  line-height: 32px;
}
</style>
