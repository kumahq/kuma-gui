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
      <div class="service-mode-list">
        <ServiceBox
          :active="mode === 'demo'"
          @clicked="setMode('demo')"
        >
          <div class="service-box-content">
            <img src="@/assets/images/new-service-demo.svg?url">

            <p class="service-mode-title">
              Demo app
            </p>

            <p>Counter application</p>
          </div>
        </ServiceBox>

        <ServiceBox
          :active="mode === 'manually'"
          @clicked="setMode('manually')"
        >
          <div class="service-box-content">
            <img src="@/assets/images/new-service-manually.svg?url">

            <p class="service-mode-title">
              Manually
            </p>

            <p>After this wizard</p>
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

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import ServiceBox from '../components/ServiceBox.vue'
import { useStore } from '@/store/store'

const store = useStore()

const mode = ref<'demo' | 'manually'>(store.state.onboarding.mode)
const nextStep = computed(() => mode.value === 'manually' ? 'onboarding-completed' : 'onboarding-add-services-code')

watch(() => mode.value, function () {
  store.dispatch('onboarding/changeMode', mode.value)
})

function setMode(newMode: typeof mode.value): void {
  mode.value = newMode
}
</script>

<style lang="scss" scoped>
.service-mode-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.service-box-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-mode-title {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
