<template>
  <XCard
    class="data-card"
  >
    <dl>
      <div class="card">
        <dt class="title">
          <slot name="title" />
        </dt>
        <dd class="body">
          <slot name="default" />
        </dd>
      </div>
    </dl>
  </XCard>
</template>
<style lang="scss" scoped>
.data-card {
  padding: var(--x-space-50);
}

.data-card :deep(.card-content) {
  font-size: var(--x-font-size-20);
}
.card {
  overflow: hidden;
}
.card,
.body {
  display: flex;
  flex-wrap: wrap;
  gap: var(--x-space-40);
  align-items: flex-start;
}
.body > :deep(dl) {
  column-gap: var(--x-space-80);
}
.body,
.card {
  flex-direction: column;
}
.title {
  font-weight: var(--x-font-weight-semibold);
  font-size: var(--x-font-size-60);
  width: 100%;
}
.body > :deep(dl) > div {
  column-gap: var(--x-space-20);
  > dt {
    color: var(--x-color-text-disabled);
  }
  > dd  {
    color: var(--x-color-text);
  }
}
</style>
