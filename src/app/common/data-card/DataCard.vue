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
  gap: $kui-space-40;
  align-items: flex-start;
}
.card {
  flex-direction: column;
}
.title {
  /* FIXME(jc): Usually this is 1.5 but that looks way to large */
  line-height: 1.2;

  font-weight: $kui-font-weight-semibold;
  font-size: $kui-font-size-60;
}
.body > :deep(dl) {
  gap: $kui-space-80;
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
