<template>
  <RouteView
    v-slot="{ can }"
  >
    <RouteTitle
      :title="t('onboarding.routes.configuration-types.title')"
    />
    <AppView>
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
            :next-step="can('use zones') ? 'onboarding-multi-zone' : 'onboarding-create-mesh'"
            previous-step="onboarding-deployment-types"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KRadio } from '@kong/kongponents'
import { computed, onMounted, ref } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import {
  useKubernetesGraph,
  useMemoryGraph,
  usePostgresGraph,
} from '@/components'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const KubernetesGraph = useKubernetesGraph()
const MemoryGraph = useMemoryGraph()
const PostgresGraph = usePostgresGraph()

const componentMap: Record<string, any> = {
  postgres: PostgresGraph,
  memory: MemoryGraph,
  kubernetes: KubernetesGraph,
}

const store = useStore()
const { t } = useI18n()

const mode = ref<'kubernetes' | 'postgres' | 'memory'>('kubernetes')

onMounted(function () {
  mode.value = store.getters['config/getConfigurationType']
})

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
  gap: $kui-space-80;
  margin-bottom: $kui-space-60;
}

.radio-button-group .k-radio {
  cursor: pointer;
}
</style>
