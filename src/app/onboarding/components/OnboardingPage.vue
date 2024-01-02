<template>
  <div>
    <div class="onboarding-container">
      <div class="onboarding-container__header">
        <slot name="header" />
      </div>

      <div
        class="onboarding-container__content"
        :class="{ 'onboarding-container__content--with-image': props.withImage }"
      >
        <div class="onboarding-container__inner-content">
          <slot name="content" />
        </div>
      </div>

      <div class="mt-4">
        <slot name="navigation" />
      </div>
    </div>

    <div class="background-image" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  withImage: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.onboarding-container {
  width: 100%;
  margin: 0 auto;
  padding: $kui-space-60;
  background-color: #fff;
  box-shadow: var(--onboarding-shadow);

  @media (min-width: 768px) {
    max-width: 1075px;
  }
    position: absolute;
    left: 0;
    right: 0;

  @media (min-height: 950px) {
    top: 50%;
    transform: translateY(-50%);
  }
}

.onboarding-container__header {
  margin-bottom: $kui-space-80;
}

.onboarding-container__content {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.onboarding-container__content--with-image {
  background-color: #f2f6fe;
}

.onboarding-container__inner-content {
  width: 100%;
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

  @media (max-width: 1699px) {
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
