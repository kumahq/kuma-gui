<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Go to the dashboard" />
    </template>
    <template #content>
      <p class="text-center mb-12">
        You have completed the initial wizard! You can now visualize the dashboard were you can find:
      </p>
      <div class="flex justify-center">
        <img src="@/assets/images/kuma_gui.png?external">
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="global-overview"
        next-step-title="Completed"
        last-step
        :show-skip="false"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'Completed',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  metaInfo() {
    return {
      title: 'Completed',
    }
  },
}
</script>
