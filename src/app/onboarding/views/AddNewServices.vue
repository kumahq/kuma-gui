<template>
  <RouteView
    v-slot="{ t }"
    name="onboarding-add-services"
  >
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
              data-testid="onboarding-demo"
              :active="props.mode === 'demo'"
              @clicked="emit('change', 'demo')"
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
              data-testid="onboarding-manually"
              :active="props.mode === 'manually'"
              @clicked="emit('change', 'manually')"
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
            :next-step="props.mode === 'manually' ? 'onboarding-completed' : 'onboarding-add-services-code'"
            previous-step="onboarding-create-mesh"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import ServiceBox from '../components/ServiceBox.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'

const props = defineProps<{
  mode: string
}>()
const emit = defineEmits<{
  change: [value: 'demo' | 'manually']
}>()

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
