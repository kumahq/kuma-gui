<template>
  <RouteView
    v-slot="{ can, t }"
    name="home"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('main-overview.routes.item.title')"
            :render="true"
          />
        </h1>
      </template>

      <div
        class="stack"
        data-testid="detail-view-details"
      >
        <MainOverview />

        <div class="columns">
          <KCard v-if="can('use zones')">
            <template #body>
              <DataSource
                v-slot="{ data, error }: ZoneOverviewCollectionSource"
                src="/zone-cps?page=1&size=10"
              >
                <ErrorBlock
                  v-if="error"
                  :error="error"
                />

                <template v-else>
                  <div class="card-header">
                    <div class="card-title">
                      <h2>{{ t('main-overview.detail.zone_control_planes.title') }}</h2>

                      <RouterLink :to="{ name: 'zone-cp-list-view' }">
                        {{ t('main-overview.detail.health.view_all') }}
                      </RouterLink>
                    </div>
                    <!-- Here we check the length of the zones because if the length is zero then -->
                    <!-- we show a create button in the empty state for the list therefore we don't need -->
                    <!-- a repeated button here -->
                    <div
                      v-if="can('create zones') && (data?.items?.length ?? 0 > 0)"
                      class="card-actions"
                    >
                      <KButton
                        appearance="primary"
                        :to="{ name: 'zone-create-view' }"
                      >
                        <AddIcon :size="KUI_ICON_SIZE_30" />

                        {{ t('zones.index.create') }}
                      </KButton>
                    </div>
                  </div>
                  <ZoneControlPlanesList
                    data-testid="zone-control-planes-details"
                    :items="data?.items"
                  />
                </template>
              </DataSource>
            </template>
          </KCard>

          <KCard>
            <template #body>
              <DataSource
                v-slot="{ data, error }: MeshInsightCollectionSource"
                src="/meshes?page=1&size=10"
              >
                <ErrorBlock
                  v-if="error"
                  :error="error"
                />

                <template v-else>
                  <div class="card-header">
                    <div class="card-title">
                      <h2>{{ t('main-overview.detail.meshes.title') }}</h2>

                      <RouterLink :to="{ name: 'mesh-list-view' }">
                        {{ t('main-overview.detail.health.view_all') }}
                      </RouterLink>
                    </div>
                  </div>

                  <MeshInsightsList
                    data-testid="meshes-details"
                    :items="data?.items"
                  />
                </template>
              </DataSource>
            </template>
          </KCard>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { AddIcon } from '@kong/icons'

import ErrorBlock from '@/app/common/ErrorBlock.vue'
import MeshInsightsList from '@/app/meshes/components/MeshInsightsList.vue'
import { MeshInsightCollectionSource } from '@/app/meshes/sources'
import ZoneControlPlanesList from '@/app/zones/components/ZoneControlPlanesList.vue'
import { ZoneOverviewCollectionSource } from '@/app/zones/sources'
import { useMainOverview } from '@/components'
const MainOverview = useMainOverview()
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $kui-space-50;
  // Makes card header the same height as buttons so that they align with or without buttons present.
  height: 42px;
}

.card-title {
  display: flex;
  gap: $kui-space-40;
  align-items: baseline;
}
</style>
