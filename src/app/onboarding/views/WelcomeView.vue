<template>
  <div>
    <OnboardingPage>
      <template #header>
        <OnboardingHeading>
          <template #title>
            Welcome to {{ PRODUCT_NAME }}
          </template>

          <template #description>
            <p>
              Congratulations on downloading {{ PRODUCT_NAME }}! You are just a <strong>few minutes</strong> away from getting your service mesh fully online.
            </p>

            <p>
              We have automatically detected that you are running on <strong>{{ enviromentFormatted }}</strong>.
            </p>
          </template>
        </OnboardingHeading>
      </template>

      <template #content>
        <h2>
          Let’s get started:
        </h2>

        <ul class="mt-4">
          <ItemStatus
            v-for="item in statuses"
            :key="item.name"
            :name="item.name"
            :status="item.status"
          />
        </ul>
      </template>

      <template #navigation>
        <OnboardingNavigation next-step="onboarding-deployment-types" />
      </template>
    </OnboardingPage>

    <WelcomeAnimationSvg :longer="isMulticluster" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { PRODUCT_NAME } from '@/constants'
import { useStore } from '@/store/store'
import ItemStatus from '../components/ItemStatus.vue'
import WelcomeAnimationSvg from '../components/WelcomeAnimationSvg.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

const store = useStore()

const enviromentFormatted = computed(() => {
  const environment = store.getters['config/getEnvironment']
  return environment.charAt(0).toUpperCase() + environment.slice(1)
})

const isMulticluster = computed(() => store.getters['config/getMulticlusterStatus'])
const statuses = computed(() => [
  {
    name: `Run ${PRODUCT_NAME} control plane`,
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
