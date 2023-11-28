<template>
  <KCard
    class="data-card"
  >
    <template #body>
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
    </template>
  </KCard>
</template>
<style lang="scss" scoped>
.data-card {
  padding: $kui-space-50;
}
.card,
.title,
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
.body > :deep(dl) > div {
  column-gap: $kui-space-20;
}
.card {
  flex-direction: column;
}
.title {
  line-height: $kui-line-height-20;

  font-weight: $kui-font-weight-semibold;
  font-size: $kui-font-size-60;
}
.body > :deep(dl) {
  > div {
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
}

</style>
