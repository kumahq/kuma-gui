<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Create the mesh" />
    </template>
    <template #content>
      <p class="text-center mb-4">
        When you install, {{ productName }} creates a <i>default</i> mesh, but you can add as many meshes as you need.
      </p>

      <div class="flex justify-center mt-10 mb-12 pb-12">
        <div class="w-full sm:w-3/5 lg:w-2/5 p-4">
          <KTable
            :options="tableData"
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
        next-step="onboarding-adding-services"
        :previous-step="previousStep"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'PopulatingMesh',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  metaInfo() {
    return {
      title: 'Populating a Mesh',
    }
  },

  data() {
    return {
      productName: PRODUCT_NAME,
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Services', key: 'servicesAmount' },
          { label: 'DPPs', key: 'dppsAmount' },
        ],
        data: [{ name: 'default', servicesAmount: 0, dppsAmount: 0 }],
      },
    }
  },
  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
    }),
    previousStep() {
      return this.multicluster ? 'onboarding-multi-zone' : 'onboarding-backend-types'
    },
  },
}
</script>
