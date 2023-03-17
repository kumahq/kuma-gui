<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading>
        <template #title>
          Create the mesh
        </template>
      </OnboardingHeading>
    </template>

    <template #content>
      <p class="mb-4 text-center">
        When you install, {{ PRODUCT_NAME }} creates a <i>default</i> mesh, but you can add as many meshes as you need.
      </p>

      <KTable
        class="table"
        :fetcher="() => tableData"
        :headers="TABLE_HEADERS"
        disable-pagination
      />

      <p class="mt-4 text-center">
        This mesh is empty. Next, you add services and their data plane proxies.
      </p>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-add-services"
        :previous-step="previousStep"
      />
    </template>
  </OnboardingPage>
</template>

<script lang="ts" setup>
import { KTable } from '@kong/kongponents'
import { computed, ref } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import { PRODUCT_NAME } from '@/constants'
import { useStore } from '@/store/store'

const TABLE_HEADERS = [
  { label: 'Name', key: 'name' },
  { label: 'Services', key: 'servicesAmount' },
  { label: 'DPPs', key: 'dppsAmount' },
]

const store = useStore()

const tableData = ref<{ total: number, data: any [] }>({
  total: 1,
  data: [
    {
      name: 'default',
      servicesAmount: 0,
      dppsAmount: 0,
    },
  ],
})

const previousStep = computed(() => store.getters['config/getMulticlusterStatus'] ? 'onboarding-multi-zone' : 'onboarding-configuration-types')
</script>

<style lang="scss" scoped>
.table {
  width: 50%;
  margin: 0 auto;
}
</style>
