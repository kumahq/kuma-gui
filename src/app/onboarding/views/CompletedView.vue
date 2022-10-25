<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Go to the dashboard" />
    </template>

    <template #content>
      <div class="flex justify-center">
        <img src="@/assets/images/kuma_gui.png">
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="home"
        next-step-title="Completed"
        last-step
        :show-skip="false"
      />
    </template>
  </OnboardingPage>
</template>

<script lang="ts" setup>
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
</script>
