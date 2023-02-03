<template>
  <li class="item-status mb-2">
    <span class="circle mr-2">
      <KIcon
        v-if="props.status"
        icon="check"
        size="14"
        color="currentColor"
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
.item-status {
  display: flex;
  align-items: center;
}

.circle {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--grey-300);
}
</style>
