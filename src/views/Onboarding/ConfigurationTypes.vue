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
import { PRODUCT_NAME } from '@/consts'
import KubernetesGraph from '@/views/Onboarding/components/graphs/KubernetesGraph'
import PostgresGraph from '@/views/Onboarding/components/graphs/PostgresGraph'
import MemoryGraph from '@/views/Onboarding/components/graphs/MemoryGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

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
  metaInfo() {
    return {
      title: 'Configuration Types',
    }
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
