<template>
  <div
    class="box"
    :class="{ 'box--active': props.active }"
    data-testid="box"
    @click="emit('clicked')"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'clicked'): void,
}>()
</script>

<style lang="scss" scoped>
.box {
  cursor: pointer;
  height: 18rem;
  width: 18rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  border: 3px solid var(--grey-400);
  border-radius: 5px;
  box-shadow: 4px 4px 14px 4px var(--onboarding-shadow);
}

.box--active {
  border-color: var(--onboarding-accent);
}
</style>
