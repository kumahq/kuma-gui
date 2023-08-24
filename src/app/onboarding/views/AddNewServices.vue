<template>
  <RouteView>
    <RouteTitle
      :title="t('onboarding.routes.add-services.title')"
    />
    <AppView>
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
              :active="store.state.onboarding.mode === 'demo'"
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
              :active="store.state.onboarding.mode === 'manually'"
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
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import ServiceBox from '../components/ServiceBox.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const store = useStore()
const { t } = useI18n()

const nextStep = computed(() => store.state.onboarding.mode === 'manually' ? 'onboarding-completed' : 'onboarding-add-services-code')

function setMode(newMode: typeof store.state.onboarding.mode): void {
  store.dispatch('onboarding/changeMode', newMode)
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
  font-weight: $kui-font-weight-semibold;
}
</style>
