<template>
  <DefinitionCard>
    <template
      v-if="$slots.icon"
      #icon
    >
      <slot name="icon" />
    </template>

    <template #title>
      <slot name="title" />
    </template>

    <template #body>
      <span v-if="props.online !== null">{{ props.online }}</span><span
        v-if="props.online !== null"
        class="status-separator"
      >/</span><span class="status-total">{{ props.total }}</span>
    </template>
  </DefinitionCard>
</template>

<script lang="ts" setup>
import DefinitionCard from './DefinitionCard.vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },

  online: {
    type: Number,
    default: null,
  },
})
</script>

<style lang="scss" scoped>
.status-separator,
.status-separator + .status-total {
  color: $kui-color-text-neutral;
}
</style>
