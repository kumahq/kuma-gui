<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Add services" />
    </template>
    <template #content>
      <div class="h-full w-full flex justify-evenly items-center">
        <ServiceBox
          :active="mode === 'demo'"
          class="cursor-pointer"
          @clicked="update('demo')"
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
          @clicked="update('manually')"
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
import { mapGetters, mapMutations } from 'vuex'
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
    ...mapGetters({
      onboardingMode: 'onboarding/getMode',
    }),

    nextStep() {
      if (this.mode === 'manually') {
        return 'onboarding-completed'
      }

      return 'onboarding-add-services-code'
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
