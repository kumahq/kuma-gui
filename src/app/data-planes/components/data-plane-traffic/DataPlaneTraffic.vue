<template>
  <div class="service-traffic">
    <div class="actions">
      <slot name="actions" />
    </div>

    <DataCard
      class="header"
    >
      <template #title>
        <slot name="title" />
      </template>
    <!-- <slot name="data" /> -->
    </DataCard>
    <slot name="default" />
  </div>
</template>
<script lang="ts" setup>
import DataCard from '@/app/common/data-card/DataCard.vue'
</script>
<style lang="scss" scoped>
.service-traffic {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}
.actions {
  display: flex;
  gap: $kui-space-40;
  position: absolute;
  right: 0;
}
.data-card.header {
  border: 0;
}
.header :deep(.title) {
  font-size: $kui-font-size-20;
}
.header > :deep(dt) {
  display: flex;
  align-items: center;
}
.header :deep(.body dt)  {
  &::before {
    display: inline-block;
    margin-right: $kui-space-20;
    border: 4px solid;
    border-radius: 50%;
  }
  &.passthrough::before {
    content: '';
    /* TODO(jc): This border color is in the design but doesn't seem to be in @kong/design-tokens */
    border-color: #00D6A4; // $kui-color-green-40;
  }
  &.outbounds::before {
    content: '';
    border-color: $kui-color-border-primary-weak;
  }

}
</style>
