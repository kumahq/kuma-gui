<template>
  <div class="onboarding-heading">
    <h1 class="onboarding-title">
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
  padding-top: var(--spacing-xxs);
  padding-bottom: var(--spacing-xxs);
  text-align: center;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: bold;
  color: transparent;
  background-image: linear-gradient(to right, var(--OnboardingTitle));
  -webkit-background-clip: text;
  background-clip: text;
}

.onboarding-description {
  margin-top: var(--spacing-sm);
  text-align: center;
  font-size: 1.125rem;
  line-height: 1.75rem;
}
</style>
