<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading>
        <template #title>
          Add services
        </template>
      </OnboardingHeading>
    </template>

    <template #content>
      <div class="h-full w-full flex justify-evenly items-center">
        <ServiceBox
          :active="mode === 'demo'"
          class="cursor-pointer"
          @clicked="setMode('demo')"
        >
          <div>
            <img src="@/assets/images/new-service-demo.svg?url">

            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Demo app
              </p>

              <p>Counter application</p>
            </div>
          </div>
        </ServiceBox>

        <ServiceBox
          :active="mode === 'manually'"
          class="cursor-pointer"
          @clicked="setMode('manually')"
        >
          <div class="cursor-pointer">
            <img src="@/assets/images/new-service-manually.svg?url">

            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Manually
              </p>

              <p>After this wizard</p>
            </div>
          </div>
        </ServiceBox>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        :next-step="nextStep"
        previous-step="onboarding-create-mesh"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapState } from 'vuex'

import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import ServiceBox from '../components/ServiceBox.vue'

export default {
  name: 'AddNewServices',

  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    ServiceBox,
  },

  computed: {
    ...mapState({
      mode: (state) => state.onboarding.mode,
    }),

    nextStep() {
      return this.mode === 'manually' ? 'onboarding-completed' : 'onboarding-add-services-code'
    },
  },

  methods: {
    setMode(newMode) {
      this.$store.dispatch('onboarding/changeMode', newMode)
    },
  },
}
</script>
