<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading
        title="1. Choose Deployment Types"
        :description="
          `${title} is a multi-tenant system that can support multiple service meshes in the same cluster:`
        "
      />
    </template>
    <template #content>
      <div class="h-full w-full flex items-center justify-center mb-10">
        <component :is="currentGraph" />
      </div>
      <div class="radio flex text-base justify-between w-full sm:w-3/4 md:w-3/5 lg:w-1/2 absolute bottom-0 right-0 left-0 mb-10 mx-auto">
        <KRadio
          v-model="mode"
          name="mode"
          value="standalone"
        >
          Standalone Deployment
        </KRadio>
        <KRadio
          v-model="mode"
          name="mode"
          value="multi-zone"
        >
          Multi-Zone deployment
        </KRadio>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-backend-types"
        previous-step="onboarding-welcome"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import MultizoneGraph from '@/views/Onboarding/components/graphs/MultizoneGraph'
import StandaloneGraph from '@/views/Onboarding/components/graphs/StandaloneGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'DeploymentTypes',
  components: {
    MultizoneGraph,
    StandaloneGraph,
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  data() {
    return { mode: 'standalone' }
  },

  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      multicluster: 'config/getMulticlusterStatus',
    }),
    currentGraph() {
      return this.mode === 'standalone' ? 'StandaloneGraph' : 'MultizoneGraph'
    },
  },
  mounted() {
    this.mode = this.multicluster ? 'multi-zone' : 'standalone'
  },
}
</script>
