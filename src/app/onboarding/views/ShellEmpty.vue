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
  --onboarding-accent: #822dc5;
  --onboarding-accent-dark: #260d50;
  --onboarding-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);
}
</style>
