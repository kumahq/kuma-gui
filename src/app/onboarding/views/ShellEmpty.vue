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

  --graph-color-1: #290b53;
  --graph-color-2: #5a416f;
  --graph-color-3: #7b2bbc;
  --graph-color-4: #b31aab;
  --graph-color-5: #d163ce;
  --graph-color-6: #e13eaf;
  --graph-color-7: #4a4622;
  --graph-color-8: #fff182;
  --graph-color-9: #fff9ca;
}
</style>
