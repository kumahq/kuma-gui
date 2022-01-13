<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Add services" />
    </template>
    <template #content>
      <div class="h-full w-full flex justify-evenly items-center">
        <Box
          :active="mode === 'demo'"
          class="cursor-pointer"
          @clicked="update('demo')"
        >
          <div>
            <img src="@/assets/images/new-service-demo.svg?external">
            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Demo app
              </p>
              <p>Counter application</p>
            </div>
          </div>
        </Box>
        <Box
          :active="mode === 'manually'"
          class="cursor-pointer"
          @clicked="update('manually')"
        >
          <div class="cursor-pointer">
            <img src="@/assets/images/new-service-manually.svg?external">
            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Manually
              </p>
              <p>After this wizzard</p>
            </div>
          </div>
        </Box>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        :next-step="nextStep"
        previous-step="onboarding-populating-mesh"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'
import Box from '@/views/Onboarding/components/Box'

export default {
  name: 'AddingNewServices',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Box,
  },
  metaInfo() {
    return {
      title: 'Adding new services',
    }
  },
  computed: {
    ...mapGetters({
      onboardingMode: 'onboarding/getMode',
    }),

    nextStep() {
      if (this.mode === 'manually') {
        return 'onboarding-completed'
      }

      return 'onboarding-adding-services-code'
    },
    mode: {
      get() {
        return this.onboardingMode
      },
      set(value) {
        this.update(value)
      },
    },
  },
  methods: {
    ...mapMutations({
      update: 'onboarding/UPDATE_MODE',
    }),
  },
}
</script>
