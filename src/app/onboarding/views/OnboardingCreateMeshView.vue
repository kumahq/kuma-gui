<template>
  <RouteView
    name="onboarding-create-mesh-view"
    v-slot="{ can, t }"
  >
    <RouteTitle
      :title="t('onboarding.routes.create-mesh.title')"
      :render="false"
    />
    <AppView>
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
            When you install, {{ t('common.product.name') }} creates a <i>default</i> mesh, but you can add as many meshes as you need.
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
            next-step="onboarding-add-new-services-view"
            :previous-step="can('use zones') ? 'onboarding-multi-zone-view' : 'onboarding-configuration-types-view'"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

const TABLE_HEADERS = [
  { label: 'Name', key: 'name' },
  { label: 'Services', key: 'servicesAmount' },
  { label: 'DPPs', key: 'dppsAmount' },
]

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
</script>

<style lang="scss" scoped>
.table {
  width: 50%;
  margin: 0 auto;
}
</style>
