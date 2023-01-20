<template>
  <li class="flex items-center mb-2">
    <span class="circle">
      <KIcon
        v-if="props.status"
        icon="check"
        size="10"
        color="var(--kuma-purple-1)"
      />
    </span>

    {{ props.name }}
  </li>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  status: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.circle {
  @apply flex items-center justify-center text-sm w-4 h-4 rounded-full mr-2;

  background-color: rgba(var(--kuma-purple-1-rgb), 0.1);
}
</style>
