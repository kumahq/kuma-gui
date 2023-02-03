<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading>
        <template #title>
          Learn about deployments
        </template>

        <template #description>
          <p>{{ productName }} can be deployed in standalone or multi-zone mode.</p>
        </template>
      </onboardingheading>
    </template>

    <template #content>
      <div class="h-full w-full flex items-center justify-center mb-10">
        <component :is="currentGraph" />
      </div>

      <div class="radio flex text-base justify-between w-full sm:w-3/4 md:w-3/5 lg:w-1/2 absolute bottom-0 right-0 left-0 mb-10 mx-auto deployment-type-radio-buttons">
        <KRadio
          v-model="mode"
          name="mode"
          selected-value="standalone"
          data-testid="onboarding-standalone-radio-button"
        >
          Standalone deployment
        </KRadio>

        <KRadio
          v-model="mode"
          name="mode"
          selected-value="multi-zone"
          data-testid="onboarding-multi-zone-radio-button"
        >
          Multi-zone deployment
        </KRadio>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-configuration-types"
        previous-step="onboarding-welcome"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { KRadio } from '@kong/kongponents'

import { PRODUCT_NAME } from '@/constants'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import {
  useMultizoneGraph,
  useStandaloneGraph,
} from '@/components'

export default {
  name: 'DeploymentTypes',
  components: {
    MultizoneGraph: useMultizoneGraph(),
    StandaloneGraph: useStandaloneGraph(),
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    KRadio,
  },
  data() {
    return { mode: 'standalone', productName: PRODUCT_NAME }
  },

  computed: {
    ...mapGetters({
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

<style lang="scss" scoped>
.deployment-type-radio-buttons {
  --KRadioPrimary: var(--OnboardingRadio);
  color: var(--OnboardingRadio);
}

.deployment-type-radio-buttons .k-radio {
  cursor: pointer;
}
</style>
