<template>
  <KCard
    class="service-traffic-group"
    :class="`type-${props.type}`"
  >
    <div class="body">
      <slot name="default" />
    </div>
  </KCard>
</template>
<script lang="ts" setup>
const props = defineProps<{
  type: string
}>()
</script>
<style lang="scss" scoped>
.service-traffic-group .body {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}
.type-passthrough,
.type-outbound {
  padding: $kui-space-40;
  border-radius: $kui-border-radius-40;
}
.service-traffic-group {
  &.type-passthrough {
    /* TODO(jc): This border color is in the design but doesn't seem to be in @kong/design-tokens */
    border-color: #00D6A4; // $kui-color-green-40;
    background-color: $kui-color-background-success-weakest;
  }
  &.type-outbound {
    border-color: $kui-color-border-primary-weak;
    background-color: $kui-color-background-primary-weakest;
  }
  &.type-inbound {
    padding: 0;
    border-radius: 0;
    border: 0;
  }
}
</style>
