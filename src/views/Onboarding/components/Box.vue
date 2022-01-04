<template>
  <div
    data-testid="box"
    :class="classes"
    @click="$emit('clicked')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Box',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return [
        'box',
        {
          'box--active': this.active,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  @apply w-72 h-72 p-12 flex items-center justify-center;

  border: 3px solid #c2c2c2;
  border-radius: 5px;
  box-shadow: 4px 4px 14px 4px var(--OnboardingShadow);

  &--active {
    border-color: var(--OnbordingBoxBorder);
  }

  &--small {
    @apply w-32 h-40 p-4 m-2;
  }
}
</style>
