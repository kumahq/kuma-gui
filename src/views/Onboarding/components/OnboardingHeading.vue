<template>
  <div class="relative">
    <h1 class="onboarding-title">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-center text-lg mt-3"
    >
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'OnboardingHeading',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-title {
  @apply text-center text-4xl font-bold;

  background: linear-gradient(to right, var(--OnboardingTitle));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
