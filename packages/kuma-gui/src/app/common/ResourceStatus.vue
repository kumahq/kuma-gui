<template>
  <DefinitionCard>
    <template
      v-if="slots.icon"
      #icon
    >
      <slot name="icon" />
    </template>

    <template
      v-if="slots.title"
      #title
    >
      <slot name="title" />
    </template>

    <template #body>
      <XLayout
        type="separated"
      >
        <div>
          <div class="status">
            <template v-if="typeof props.online !== 'undefined'">
              <span
                :class="{ ['text-neutral']: props.online !== props.total }"
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
    </template>
  </DefinitionCard>
</template>

<script lang="ts" setup>
import DefinitionCard from './DefinitionCard.vue'

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
  color: #{$kui-color-text-neutral};
}
.description {
  font-weight: $kui-font-weight-regular;
  font-size: $kui-font-size-20;
  display: flex;
  gap: $kui-space-20;
}
</style>
