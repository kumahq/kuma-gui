<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading title="Learn about configuration storage" />
    </template>
    <template #content>
      <div class="h-full w-full flex items-center justify-center mb-10">
        <component :is="currentGraph" />
      </div>
      <div class="radio flex text-base justify-between w-full sm:w-3/4 md:w-3/5 lg:w-1/2 absolute bottom-0 right-0 left-0 mb-10 mx-auto configuration-type-radio-buttons">
        <KRadio
          v-model="mode"
          name="deployment"
          selected-value="kubernetes"
        >
          Kubernetes
        </KRadio>
        <KRadio
          v-model="mode"
          name="deployment"
          selected-value="postgres"
        >
          Postgres
        </KRadio>
        <KRadio
          v-model="mode"
          name="deployment"
          selected-value="memory"
        >
          Memory
        </KRadio>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        :next-step="nextStep"
        previous-step="onboarding-deployment-types"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/constants'
import KubernetesGraph from '../components/graphs/KubernetesGraph.vue'
import PostgresGraph from '../components/graphs/PostgresGraph.vue'
import MemoryGraph from '../components/graphs/MemoryGraph.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

export default {
  name: 'ConfigurationTypes',
  components: {
    KubernetesGraph,
    PostgresGraph,
    MemoryGraph,
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  data() {
    return { mode: 'kubernetes', productName: PRODUCT_NAME }
  },
  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
      configurationType: 'config/getConfigurationType',
    }),
    nextStep() {
      return this.multicluster ? 'onboarding-multi-zone' : 'onboarding-create-mesh'
    },
    currentGraph() {
      switch (this.mode) {
        case 'kubernetes':
          return 'KubernetesGraph'
        case 'postgres':
          return 'PostgresGraph'
        case 'memory':
          return 'MemoryGraph'
        default:
          return 'KubernetesGraph'
      }
    },
  },
  mounted() {
    this.mode = this.configurationType
  },
}
</script>

<style lang="scss" scoped>
.configuration-type-radio-buttons {
  --KRadioPrimary: var(--OnboardingRadio);
  color: var(--OnboardingRadio);
}

.configuration-type-radio-buttons .k-radio {
  cursor: pointer;
}
</style>
