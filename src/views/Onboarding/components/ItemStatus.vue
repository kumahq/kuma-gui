<template>
  <li class="flex items-center mb-2">
    <span class="circle">
      <KIcon
        v-if="status"
        icon="check"
        size="10"
        color="var(--kuma-purple-1)"
      />
    </span>
    {{ name }}
  </li>
</template>

<script>
export default {
  name: 'ItemStatus',
  props: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.circle {
  @apply flex items-center justify-center w-5 h-5 rounded-full mr-2;

  background-color: rgba(var(--kuma-purple-1-rgb), 0.1);
}
</style>
