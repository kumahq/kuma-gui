<template>
  <div class="onboarding-heading">
    <h1
      class="onboarding-title"
      data-testid="onboarding-header"
    >
      <slot name="title" />
    </h1>

    <div
      v-if="slots.description"
      class="onboarding-description"
    >
      <slot name="description" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<style lang="scss" scoped>
.onboarding-heading {
  position: relative;
}

.onboarding-title {
  padding-top: $kui-space-20;
  padding-bottom: $kui-space-20;
  text-align: center;
  font-weight: $kui-font-weight-semibold;
  color: transparent;
  background-image: linear-gradient(to right, var(--onboarding-heading-1), var(--onboarding-heading-2));
  -webkit-background-clip: text;
  background-clip: text;
}

.onboarding-description {
  margin-top: $kui-space-50;
  text-align: center;
  font-size: $kui-font-size-60;
}
</style>
