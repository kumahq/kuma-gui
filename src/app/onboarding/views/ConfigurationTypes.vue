<template>
  <RouteView
    v-slot="{ can, t }"
    name="onboarding-configuration-types"
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
          <DataSource
            v-slot="{ data }: ConfigSource"
            :src="`/config`"
            @change="change"
          >
            <template
              v-if="(typeof data !== 'undefined')"
            >
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
          </DataSource>
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
import { computed, ref } from 'vue'

import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import type { ConfigSource, Config } from '@/app/diagnostics/sources'
import {
  useKubernetesGraph,
  useMemoryGraph,
  usePostgresGraph,
} from '@/components'

const KubernetesGraph = useKubernetesGraph()
const MemoryGraph = useMemoryGraph()
const PostgresGraph = usePostgresGraph()

const componentMap: Record<string, any> = {
  postgres: PostgresGraph,
  memory: MemoryGraph,
  kubernetes: KubernetesGraph,
}

const mode = ref<'kubernetes' | 'postgres' | 'memory'>('kubernetes')

const change = (e: Config) => {
  mode.value = e.store.type
}

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
