<template>
  <RouteView>
    <RouteTitle
      :title="t('onboarding.routes.deployment-types.title')"
    />
    <AppView>
      <OnboardingPage with-image>
        <template #header>
          <OnboardingHeading>
            <template #title>
              Learn about deployments
            </template>

            <template #description>
              <p>{{ t('common.product.name') }} can be deployed in standalone or multi-zone mode.</p>
            </template>
          </onboardingheading>
        </template>

        <template #content>
          <div class="graph-list mb-6">
            <component :is="currentGraphComponent" />
          </div>

          <div class="radio-button-group">
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
  useMultizoneGraph,
  useStandaloneGraph,
} from '@/components'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const MultizoneGraph = useMultizoneGraph()
const StandaloneGraph = useStandaloneGraph()

const componentMap: Record<string, any> = {
  standalone: StandaloneGraph,
  'multi-zone': MultizoneGraph,
}

const store = useStore()
const { t } = useI18n()

const mode = ref<'standalone' | 'multi-zone'>('standalone')

const currentGraphComponent = computed(() => componentMap[mode.value])

onMounted(function () {
  mode.value = store.getters['config/getMulticlusterStatus'] ? 'multi-zone' : 'standalone'
})
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
