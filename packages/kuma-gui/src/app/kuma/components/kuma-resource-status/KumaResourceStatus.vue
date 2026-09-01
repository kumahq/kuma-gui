<template>
  <XLayout
    variant="y-stack"
    size="small"
  >
    <div
      v-if="slots.icon || slots.title"
      class="definition-card-title"
    >
      <slot
        name="icon"
      />
      <slot
        name="title"
      />
    </div>

    <XLayout
      class="definition-card-container"
      variant="x-stack"
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
  </XLayout>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  total: number
  online?: number
  description?: string
}>(), {
  online: undefined,
  description: undefined,
})
const slots = defineSlots()
</script>

<style lang="scss" scoped>
.text-neutral {
  color: var(--x-color-text-neutral);
}
.description {
  display: flex;
  gap: var(--x-space-20);
  font-weight: var(--x-font-weight-regular);
  font-size: var(--x-font-size-20);
}

.definition-card {
  display: flex;
  flex-direction: column;
  gap: var(--x-space-40);
}

.definition-card-title {
  display: flex;
  align-items: center;
  gap: var(--x-space-40);
}

.definition-card-container {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  font-size: var(--x-font-size-60);
  font-weight: var(--x-font-weight-bold);
}

.definition-card-container > * {
  min-width: 0;
}

</style>
