<template>
  <KCard
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
  </KCard>
</template>
<style lang="scss" scoped>
.data-card {
  padding: $kui-space-50;
}

.data-card :deep(.card-content) {
  font-size: $kui-font-size-20;
}

.card,
.title,
.body,
.body > :deep(dl),
.body > :deep(dl) > div {
  display: flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
  align-items: flex-start;
}
.body > :deep(dl) {
  column-gap: $kui-space-80;
}
.body,
.card {
  flex-direction: column;
}
.title {
  font-weight: $kui-font-weight-semibold;
  font-size: $kui-font-size-60;
  width: 100%;
}
.body > :deep(dl) > div {
  column-gap: $kui-space-20;
  > dt {
    color: $kui-color-text-disabled;
  }
  > dd  {
    color: $kui-color-text;
  }
  > dt::after {
    display: inline;
    /*[lang="en"]*/
    content: ': ';
  }
}

</style>
