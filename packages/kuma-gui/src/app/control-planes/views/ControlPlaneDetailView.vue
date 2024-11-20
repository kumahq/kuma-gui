<template>
  <RouteView
    name="home"
    v-slot="{ can, t, uri, me }"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('main-overview.routes.item.title')"
          />
        </h1>
      </template>
      <template #actions>
        <ControlPlaneActionGroup />
      </template>

      <div
        class="stack"
      >
        <DataLoader
          :src="uri(ControlPlaneSources, '/global-insight', {})"
          v-slot="{ data }"
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
                  <div
                    class="card-actions"
                  >
                    <XTeleportSlot name="control-plane-detail-view-zone-actions" />
                  </div>
                </div>

                <ZoneControlPlanesList
                  data-testid="zone-control-planes-details"
                  :items="data?.items"
                  :storage="me"
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
                  :storage="me"
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

import { sources as ControlPlaneSources } from '../sources'
import { useControlPlaneStatus, useControlPlaneActionGroup } from '@/app/control-planes'
import MeshInsightsList from '@/app/meshes/components/MeshInsightsList.vue'
import { sources as MeshSources } from '@/app/meshes/sources'
import { useZoneControlPlanesList } from '@/app/zones'
import { sources as ZoneSources } from '@/app/zones/sources'

const ControlPlaneStatus = useControlPlaneStatus()
const ControlPlaneActionGroup = useControlPlaneActionGroup()
const ZoneControlPlanesList = useZoneControlPlanesList()
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
