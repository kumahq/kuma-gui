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
      <p class="text-center mb-4">
        When you install, {{ productName }} creates a <i>default</i> mesh, but you can add as many meshes as you need.
      </p>

      <div class="flex justify-center mt-10 mb-12 pb-12">
        <div class="w-full sm:w-3/5 lg:w-2/5 p-4">
          <KTable
            :fetcher="() => tableData"
            :headers="tableHeaders"
            disable-pagination
            is-small
          />
        </div>
      </div>

      <p class="text-center">
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

<script>
import { mapGetters } from 'vuex'
import { KTable } from '@kong/kongponents'

import { PRODUCT_NAME } from '@/constants'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

export default {
  name: 'CreateMesh',

  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    KTable,
  },

  data() {
    return {
      productName: PRODUCT_NAME,
      tableHeaders: [
        { label: 'Name', key: 'name' },
        { label: 'Services', key: 'servicesAmount' },
        { label: 'DPPs', key: 'dppsAmount' },
      ],
      tableData: {
        total: 1,
        data: [
          {
            name: 'default',
            servicesAmount: 0,
            dppsAmount: 0,
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
    }),
    previousStep() {
      return this.multicluster ? 'onboarding-multi-zone' : 'onboarding-configuration-types'
    },
  },
}
</script>
