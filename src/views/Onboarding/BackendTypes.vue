<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading title="2. Choose Backend Types" />
    </template>
    <template #content>
      <div class="h-full w-full flex items-center justify-center mb-10">
        <component :is="currentGraph" />
      </div>
      <div class="radio flex text-base justify-between w-full sm:w-3/4 md:w-3/5 lg:w-1/2 absolute bottom-0 right-0 left-0 mb-10 mx-auto">
        <KRadio
          v-model="mode"
          name="deployment"
          value="kubernetess"
        >
          Kubernetess
        </KRadio>
        <KRadio
          v-model="mode"
          name="deployment"
          value="postgres"
        >
          Postgres
        </KRadio>
        <KRadio
          v-model="mode"
          name="deployment"
          value="memory"
        >
          Memory
        </KRadio>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-populating-mesh"
        previous-step="onboarding-deployment-types"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import KubernetesGraph from '@/views/Onboarding/components/graphs/KubernetesGraph'
import PostgresGraph from '@/views/Onboarding/components/graphs/PostgresGraph'
import MemoryGraph from '@/views/Onboarding/components/graphs/MemoryGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'BackendTypes',
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
      title: 'Backend Types',
    }
  },
  data() {
    return { mode: 'kubernetess' }
  },
  computed: {
    currentGraph() {
      switch (this.mode) {
        case 'kubernetess':
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
}
</script>
