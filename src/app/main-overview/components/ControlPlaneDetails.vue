<template>
  <div class="stack">
    <KCard>
      <template #body>
        <div class="card-header">
          <div class="card-title">
            <h2>{{ t('main-overview.detail.health.title') }}</h2>
          </div>
        </div>

        <div
          class="columns"
          style="--columns: 4;"
        >
          <ResourceStatus
            :total="store.getters['config/getMulticlusterStatus'] ? props.zoneOverviews.length : 1"
            data-testid="zone-control-planes-status"
          >
            <template #icon>
              <img src="@/assets/images/icon-location-on.svg?url">
            </template>

            <template #title>
              {{ t('main-overview.detail.health.zone_control_planes') }}
            </template>
          </ResourceStatus>

          <ResourceStatus
            :total="meshInsight.meshesTotal"
            data-testid="meshes-status"
          >
            <template #icon>
              <img src="@/assets/images/icon-circles-ext.svg?url">
            </template>

            <template #title>
              {{ t('main-overview.detail.health.meshes') }}
            </template>
          </ResourceStatus>

          <ResourceStatus
            :total="meshInsight.services.total"
            data-testid="services-status"
          >
            <template #icon>
              <img src="@/assets/images/icon-wifi-tethering.svg?url">
            </template>

            <template #title>
              {{ t('main-overview.detail.health.services') }}
            </template>
          </ResourceStatus>

          <ResourceStatus
            :total="meshInsight.dataPlaneProxies.total"
            data-testid="data-plane-proxies-status"
          >
            <template #icon>
              <img src="@/assets/images/icon-wifi-tethering.svg?url">
            </template>

            <template #title>
              {{ t('main-overview.detail.health.data_plane_proxies') }}
            </template>
          </ResourceStatus>
        </div>
      </template>
    </KCard>

    <div
      class="columns"
      style="--columns: 2;"
    >
      <KCard v-if="store.getters['config/getMulticlusterStatus']">
        <template #body>
          <div class="card-header">
            <div class="card-title">
              <h2>{{ t('main-overview.detail.zone_control_planes.title') }}</h2>

              <RouterLink :to="{ name: 'zone-cp-list-view' }">
                {{ t('main-overview.detail.health.view_all') }}
              </RouterLink>
            </div>
          </div>

          <EmptyBlock v-if="props.zoneOverviews.length === 0">
            {{ t('main-overview.detail.zone_control_planes.empty_state.title') }}

            <template
              v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
              #message
            >
              {{ t('main-overview.detail.zone_control_planes.empty_state.message') }}
            </template>

            <template
              v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
              #cta
            >
              <KButton
                appearance="creation"
                icon="plus"
                :to="{ name: 'zone-create-view' }"
              >
                {{ t('zones.index.create') }}
              </KButton>
            </template>
          </EmptyBlock>

          <ZoneControlPlanesDetails
            v-else
            data-testid="zone-control-planes-details"
            :zone-overviews="props.zoneOverviews.slice(0, 10)"
          />
        </template>
      </KCard>

      <KCard>
        <template #body>
          <div class="card-header">
            <div class="card-title">
              <h2>{{ t('main-overview.detail.meshes.title') }}</h2>

              <RouterLink :to="{ name: 'mesh-list-view' }">
                {{ t('main-overview.detail.health.view_all') }}
              </RouterLink>
            </div>
          </div>

          <EmptyBlock v-if="props.meshInsights.length === 0" />

          <MeshesDetails
            v-else
            data-testid="meshes-details"
            :mesh-insights="props.meshInsights.slice(0, 10)"
          />
        </template>
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import MeshesDetails from './MeshesDetails.vue'
import ZoneControlPlanesDetails from './ZoneControlPlanesDetails.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import { mergeInsightsReducer } from '@/store/reducers/mesh-insights'
import { useStore } from '@/store/store'
import { MeshInsight, ZoneOverview } from '@/types/index.d'
import { useEnv, useI18n } from '@/utilities'

const env = useEnv()
const { t } = useI18n()
const store = useStore()

const props = defineProps({
  meshInsights: {
    type: Array as PropType<MeshInsight[]>,
    default: () => [],
  },

  zoneOverviews: {
    type: Array as PropType<ZoneOverview[]>,
    default: () => [],
  },
})

const meshInsight = computed(() => mergeInsightsReducer(props.meshInsights))
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.card-title {
  display: flex;
  gap: var(--spacing-xs);
  align-items: baseline;
}

.card-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
}
</style>
