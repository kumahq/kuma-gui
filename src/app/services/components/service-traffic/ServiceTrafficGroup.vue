<template>
  <div class="service-traffic-group">
    <KCard
      :class="`type-${props.type}`"
    >
      <template #body>
        <slot name="default" />
      </template>
    </KCard>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  type: string
}>()
</script>
<style lang="scss" scoped>
.service-traffic-group :deep(.k-card-body) {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}
.type-passthrough,
.type-outbound {
  padding: $kui-space-40;
  border-radius: $kui-border-radius-40;
}
.kong-card {
  &:is(.type-passthrough) {
    /* FIXME(jc): These colors is in the design but don't seem to be in @kong/design-tokens */
    border-color: #00D6A4;
    background-color: #ECFFFB;
  }
  &:is(.type-outbound) {
    border-color: $kui-color-border-primary-weak;
    background-color: $kui-color-border-primary-weakest;
  }
  &:is(.type-inbound) {
    padding: 0;
    border-radius: 0;
    border: 0;
  }
}
</style>
