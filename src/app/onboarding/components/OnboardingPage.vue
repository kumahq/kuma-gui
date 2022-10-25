<template>
  <div>
    <div class="onboarding-container">
      <div class="onboarding-container__header">
        <slot name="header" />
      </div>
      <div :class="classes">
        <div class="w-full">
          <slot name="content" />
        </div>
      </div>
      <slot name="navigation" />
    </div>

    <div class="background-image" />
  </div>
</template>

<script>
export default {
  name: 'OnboardingContainer',
  props: {
    withImage: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return ['onboarding-container__content', this.withImage ? 'onboarding-container__content--with-image' : '']
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  @apply w-full mx-auto my-0 px-4;

  &__header {
    @apply my-10;
  }

  &__content {
    @apply relative flex items-center justify-center p-10 w-full bg-white text-lg;
    min-height: 500px;
    box-shadow: var(--OnboardingShadow);

    --KTableHeaderSize: 18px;

    &--with-image {
      background: var(--OnboardingPageGraphBackground);
    }
  }

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }

  @media screen and (min-height: 950px) {
    width: 100%;
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
}

.background-image {
  position: fixed;
  top: 0;
  z-index: -2;
  opacity: 0.05;
  left: 0;
  height: 100vh;
  filter: grayscale(1);
  width: 100vw;
  background: transparent url('@/assets/images/onboarding-background.svg?url') no-repeat scroll 0% 0%;

  min-width: 1700px;

  @media screen and (max-width: 1699px) {
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
