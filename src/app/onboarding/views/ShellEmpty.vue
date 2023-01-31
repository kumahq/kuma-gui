<template>
  <router-view
    v-slot="{ Component }"
    class="onboarding-view"
  >
    <transition
      mode="out-in"
      name="fade"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.onboarding-view {
  --kuma-purple-1: #260d50;
  --kuma-purple-2: #822dc5;
  --OnboardingRadio: #5da46f;
  --OnboardingPageGraphBackground: #f6f8fd;
  --OnboardingNextButton: #5da46f;
  --OnboardingNextButtonHover: #539464;
  --OnboardingBackButton: #f6f8fd;
  --OnboardingBackButtonHover: #e1e8f8;
  --OnboardingSkipSetupButton: rgba(38, 13, 80, 0.3);
  --OnbordingBoxBorder: #7b2bbc;
  --OnboardingLoading: 130, 45, 197;
  --OnboardingShadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);
}
</style>
