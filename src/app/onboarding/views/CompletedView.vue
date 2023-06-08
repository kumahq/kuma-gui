<template>
  <RouteView>
    <RouteTitle
      :title="t('onboarding.routes.completed.title')"
    />
    <AppView>
      <OnboardingPage>
        <template #header>
          <OnboardingHeading>
            <template #title>
              Go to the dashboard
            </template>
          </OnboardingHeading>
        </template>

        <template #content>
          <div class="gui-preview-image">
            <img src="@/assets/images/kuma_gui.png">
          </div>
        </template>

        <template #navigation>
          <OnboardingNavigation
            next-step="home"
            next-step-title="Complete"
            last-step
            :show-skip="false"
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
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.gui-preview-image {
  display: flex;
  justify-content: center;
}
</style>
