<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading>
        <template #title>
          Learn about configuration storage
        </template>
      </OnboardingHeading>
    </template>

    <template #content>
      <div class="graph-list mb-6">
        <component :is="currentGraphComponent" />
      </div>

      <div class="radio-button-group">
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

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { KRadio } from '@kong/kongponents'

import { useStore } from '@/store/store'
import {
  useKubernetesGraph,
  useMemoryGraph,
  usePostgresGraph,
} from '@/components'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

const KubernetesGraph = useKubernetesGraph()
const MemoryGraph = usePostgresGraph()
const PostgresGraph = useMemoryGraph()

const componentMap: Record<string, any> = {
  postgres: PostgresGraph,
  memory: MemoryGraph,
  kubernetes: KubernetesGraph,
}

const store = useStore()

const mode = ref<'kubernetes' | 'postgres' | 'memory'>('kubernetes')

onMounted(function () {
  mode.value = store.getters['config/getConfigurationType']
})

const nextStep = computed(() => store.getters['config/getMulticlusterStatus'] ? 'onboarding-multi-zone' : 'onboarding-create-mesh')

const currentGraphComponent = computed(() => componentMap[mode.value])
</script>

<style lang="scss" scoped>
.graph-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.radio-button-group {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.radio-button-group .k-radio {
  cursor: pointer;
}
</style>
