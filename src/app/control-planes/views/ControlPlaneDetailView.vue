<template>
  <RouteView
    v-slot="{ can, t, uri }"
    name="home"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('main-overview.routes.item.title')"
          />
        </h1>
      </template>

      <div
        class="stack"
      >
        <DataLoader
          v-slot="{ data }"
          :src="uri(ControlPlaneSources, '/global-insight', {})"
        >
          <ControlPlaneStatus
            :can-use-zones="can('use zones')"
            :global-insight="data"
          />
        </DataLoader>

        <div class="columns">
          <KCard
            v-if="can('use zones')"
          >
            <DataLoader
              :src="uri(ZoneSources, '/zone-cps', {}, {
                page: 1,
                size: 10,
              })"
            >
              <template
                #loadable="{ data }"
              >
                <div class="card-header">
                  <div class="card-title">
                    <h2>
                      {{ t('main-overview.detail.zone_control_planes.title') }}
                    </h2>

                    <XAction
                      :to="{ name: 'zone-cp-list-view' }"
                    >
                      {{ t('main-overview.detail.health.view_all') }}
                    </XAction>
                  </div>
                  <!-- Here we check the length of the zones because if the length is zero then -->
                  <!-- we show a create button in the empty state for the list therefore we don't need -->
                  <!-- a repeated button here -->
                  <div
                    v-if="(data?.items.length ?? 0 > 0) && can('create zones')"
                    class="card-actions"
                  >
                    <KButton
                      appearance="primary"
                      :to="{ name: 'zone-create-view' }"
                    >
                      <AddIcon />

                      {{ t('zones.index.create') }}
                    </KButton>
                  </div>
                </div>

                <ZoneControlPlanesList
                  data-testid="zone-control-planes-details"
                  :items="data?.items"
                />
              </template>
            </DataLoader>
          </KCard>

          <KCard>
            <DataLoader
              :src="uri(MeshSources, '/mesh-insights', {}, {
                page: 1,
                size: 10,
              })"
            >
              <template
                #loadable="{ data }"
              >
                <div class="card-header">
                  <div class="card-title">
                    <h2>
                      {{ t('main-overview.detail.meshes.title') }}
                    </h2>

                    <XAction
                      :to="{ name: 'mesh-list-view' }"
                    >
                      {{ t('main-overview.detail.health.view_all') }}
                    </XAction>
                  </div>
                </div>

                <MeshInsightsList
                  data-testid="meshes-details"
                  :items="data?.items"
                />
              </template>
            </DataLoader>
          </KCard>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { AddIcon } from '@kong/icons'

import { sources as ControlPlaneSources } from '../sources'
import { useControlPlaneStatus } from '@/app/control-planes'
import MeshInsightsList from '@/app/meshes/components/MeshInsightsList.vue'
import { sources as MeshSources } from '@/app/meshes/sources'
import ZoneControlPlanesList from '@/app/zones/components/ZoneControlPlanesList.vue'
import { sources as ZoneSources } from '@/app/zones/sources'

const ControlPlaneStatus = useControlPlaneStatus()
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $kui-space-50;
  // Makes card header the same height as buttons so that they align with or without buttons present.
  min-height: 32px;
}

.card-title {
  display: flex;
  gap: $kui-space-40;
  align-items: baseline;
}
</style>
