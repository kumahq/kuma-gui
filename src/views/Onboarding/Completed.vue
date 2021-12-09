<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        title="Go to the dashboard"
        description="You have completed the initial wizard! You can now visualize the dashboard were you can find:"
      />
    </template>
    <template #content>
      <div>
        <div class="flex justify-center">
          <img src="@/assets/images/kuma_gui.png?external">
        </div>
        <div class="justify-between flex mt-8 flex-wrap">
          <Box
            v-for="item in items"
            :key="item"
            small
          >
            <div class="flex h-full items-end font-bold tracking-wider">
              {{ item }}
            </div>
          </Box>
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="global-overview"
        next-step-title="Go to dashboard"
        last-step
        :show-skip="false"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import Box from '@/views/Onboarding/components/Box'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'Completed',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Box,
  },
  metaInfo() {
    return {
      title: 'Completed',
    }
  },
  data() {
    return {
      items: ['MESHES', 'ZONES', 'SERVICES', 'DPPs', 'POLICIES'],
    }
  },
}
</script>
