<template>
  <div class="resource-status">
    <div
      v-if="slots.icon || slots.title"
      class="resource-status-title"
    >
      <slot name="icon" />
      <slot name="title" />
    </div>

    <div class="resource-status-content">
      <XLayout
        type="separated"
      >
        <div>
          <div class="status">
            <template v-if="typeof props.online !== 'undefined'">
              <span
                :class="{ 'text-neutral': props.online !== props.total }"
              >{{ props.online }}</span><span class="status-separator">/</span>
            </template><span>{{ props.total }}</span>
          </div>
          <div
            v-if="slots.description"
            class="description"
          >
            <slot name="description" />
          </div>
        </div>

        <slot name="body" />
      </XLayout>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  total: number
  online?: number
}>(), {
  online: undefined,
})
const slots = defineSlots()
</script>

<style lang="scss" scoped>
.resource-status {
  display: flex;
  gap: $kui-space-40;
  justify-content: space-between;
  align-items: baseline;
}

.resource-status-title {
  display: flex;
  align-items: center;
  gap: unset;

  &::after {
    content: ": ";
    display: inline;
  }
}

.resource-status-content {
  display: flex;
  align-items: flex-start;
  font-weight: $kui-font-weight-bold;
}

.text-neutral {
  color: #{$kui-color-text-neutral};
}

.description {
  font-weight: $kui-font-weight-regular;
  font-size: $kui-font-size-20;
  display: flex;
  gap: $kui-space-20;
}
</style>

<style lang="scss">
.resource-status-content > * {
  min-width: 0;
}
</style>
