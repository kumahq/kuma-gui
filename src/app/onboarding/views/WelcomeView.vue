<template>
  <RouteView>
    <RouteTitle
      :title="t('onboarding.routes.welcome.title', {name: t('common.product.name')})"
    />
    <AppView>
      <div>
        <OnboardingPage>
          <template #header>
            <OnboardingHeading>
              <template #title>
                Welcome to {{ t('common.product.name') }}
              </template>

              <template #description>
                <p>
                  Congratulations on downloading {{ t('common.product.name') }}! You are just a <strong>few minutes</strong> away from getting your service mesh fully online.
                </p>

                <p>
                  We have automatically detected that you are running on <strong>{{ enviromentFormatted }}</strong>.
                </p>
              </template>
            </OnboardingHeading>
          </template>

          <template #content>
            <h2 class="text-center">
              Let’s get started:
            </h2>

            <div class="item-status-list-wrapper">
              <ul class="item-status-list">
                <li
                  v-for="item in statuses"
                  :key="item.name"
                >
                  <span class="circle mr-2">
                    <KIcon
                      v-if="item.status"
                      icon="check"
                      :size="KUI_ICON_SIZE_30"
                      color="currentColor"
                    />
                  </span>

                  {{ item.name }}
                </li>
              </ul>
            </div>
          </template>

          <template #navigation>
            <OnboardingNavigation next-step="onboarding-deployment-types" />
          </template>
        </OnboardingPage>

        <WelcomeAnimationSvg :longer="isMulticluster" />
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KIcon } from '@kong/kongponents'
import { computed } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import WelcomeAnimationSvg from '../components/WelcomeAnimationSvg.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const store = useStore()
const { t } = useI18n()

const enviromentFormatted = computed(() => {
  const environment = store.getters['config/getEnvironment']
  return environment.charAt(0).toUpperCase() + environment.slice(1)
})

const isMulticluster = computed(() => store.getters['config/getMulticlusterStatus'])
const statuses = computed(() => [
  {
    name: `Run ${t('common.product.name')} control plane`,
    status: true,
  },
  {
    name: 'Learn about deployments',
    status: false,
  },
  {
    name: 'Learn about configuration storage',
    status: false,
  },
  ...isMulticluster.value ? [{ name: 'Add zones', status: false }] : [],
  {
    name: 'Create the mesh',
    status: false,
  },
  {
    name: 'Add services',
    status: false,
  },
  {
    name: 'Go to the dashboard',
    status: false,
  },
])
</script>

<style lang="scss" scoped>
.item-status-list-wrapper {
  display: flex;
  justify-content: center;
}

.item-status-list {
  margin-top: $kui-space-60;
}

.item-status-list > * + * {
  margin-top: $kui-space-40;
}

.circle {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7ec;
}
</style>
