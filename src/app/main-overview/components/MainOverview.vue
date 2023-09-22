<template>
  <div
    class="stack"
    data-testid="detail-view-details"
  >
    <KCard>
      <template #body>
        <DataSource
          v-slot="{ data, error }: GlobalInsightSource"
          src="/global-insight"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <template v-else>
            <div class="card-header">
              <div class="card-title">
                <h2>{{ t('main-overview.detail.health.title') }}</h2>
              </div>
            </div>

            <div
              class="columns"
              :style="`--columns: ${can('use zones') ? 4 : 3};`"
            >
              <ResourceStatus
                v-if="can('use zones')"
                :total="data.zones.controlPlanes.total"
                :online="data.zones.controlPlanes.online"
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
                :total="data.meshes.total"
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
                :total="data.services.internal.total"
                :online="data.services.internal.online"
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
                :total="data.dataplanes.standard.total"
                :online="data.dataplanes.standard.online"
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
        </DataSource>
      </template>
    </KCard>

    <div class="variable-columns">
      <KCard v-if="can('use zones')">
        <template #body>
          <DataSource
            v-slot="{ data: zoneOverviewsData, error: zoneOverviewsError }: ZoneOverviewCollectionSource"
            src="/zone-cps?page=1&size=10"
          >
            <ErrorBlock
              v-if="zoneOverviewsError"
              :error="zoneOverviewsError"
            />

            <LoadingBlock v-else-if="zoneOverviewsData === undefined" />

            <template v-else>
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t('main-overview.detail.zone_control_planes.title') }}</h2>

                  <RouterLink :to="{ name: 'zone-cp-list-view' }">
                    {{ t('main-overview.detail.health.view_all') }}
                  </RouterLink>
                </div>

                <div
                  v-if="can('create zones') && zoneOverviewsData.items.length > 0"
                  class="card-actions"
                >
                  <KButton
                    appearance="primary"
                    icon="plus"
                    :to="{ name: 'zone-create-view' }"
                  >
                    {{ t('zones.index.create') }}
                  </KButton>
                </div>
              </div>

              <ZoneControlPlanesDetails
                data-testid="zone-control-planes-details"
                :zone-overviews="zoneOverviewsData.items"
              />
            </template>
          </DataSource>
        </template>
      </KCard>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data: meshInsightsData, error: meshInsightsError }: MeshInsightCollectionSource"
            src="/mesh-insights?page=1&size=10"
          >
            <ErrorBlock
              v-if="meshInsightsError"
              :error="meshInsightsError"
            />

            <LoadingBlock v-else-if="meshInsightsData === undefined" />

            <template v-else>
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t('main-overview.detail.meshes.title') }}</h2>

                  <RouterLink :to="{ name: 'mesh-list-view' }">
                    {{ t('main-overview.detail.health.view_all') }}
                  </RouterLink>
                </div>
              </div>

              <MeshesDetails
                data-testid="meshes-details"
                :mesh-insights="meshInsightsData.items"
              />
            </template>
          </DataSource>
        </template>
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import MeshesDetails from './MeshesDetails.vue'
import ZoneControlPlanesDetails from './ZoneControlPlanesDetails.vue'
import { GlobalInsightSource } from '../sources'
import { useCan } from '@/app/application'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import { MeshInsightCollectionSource } from '@/app/meshes/sources'
import { ZoneOverviewCollectionSource } from '@/app/zones/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const can = useCan()
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $kui-space-60;
  // Makes card header the same height as buttons so that they align with or without buttons present.
  height: 42px;
}

.card-title {
  display: flex;
  gap: $kui-space-40;
  align-items: baseline;
}

.card-actions {
  display: flex;
  gap: $kui-space-60;
  align-items: flex-end;
}
</style>
