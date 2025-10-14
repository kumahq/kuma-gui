<template>
  <RouteView
    :name="props.routeName"
    v-slot="{ can, t, uri, me, route }"
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

      <XLayout
        type="stack"
      >
        <DataSource
          :src="uri(PolicySources, '/policy-types', {})"
          v-slot="{ data: resources }"
        >
          <DataLoader
            :src="uri(ControlPlaneSources, '/global-insight', {})"
            v-slot="{ data }"
          >
            <ControlPlaneStatus
              :can-use-zones="can('use zones')"
              :global-insight="data"
              :resources="resources"
            />
          </DataLoader>
        </DataSource>
        <XLayout
          type="columns"
        >
          <DataLoader
            :src="uri(PolicySources, '/kri/policy/:kri', { kri: 'kri_asd__my-zone_my-ns_fooo_bla' })"
            v-slot="{ data }"
          >
            {{ data }}
            <!-- {{ console.log(data) }} -->
          </DataLoader>
          <XCard
            v-if="can('use zones')"
          >
            <DataLoader
              :src="uri(ZoneSources, '/zone-cps', {}, {
                page: 1,
                size: 10,
              })"
              variant="list"
              v-slot="{ data }"
            >
              <div class="card-header">
                <div class="card-title">
                  <h2>
                    {{ t('main-overview.detail.zone_control_planes.title') }}
                  </h2>

                  <XAction
                    :to="{ name: 'zone-cp-list-view' }"
                  >
                    {{ t('main-overview.detail.about.view_all') }}
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
                :items="data.items"
                :storage="me"
              />
            </DataLoader>
          </XCard>

          <XCard>
            <DataLoader
              :src="uri(MeshSources, '/mesh-insights', {}, {
                page: 1,
                size: 10,
              })"
              variant="list"
              v-slot="{ data }"
            >
              <div class="card-header">
                <div class="card-title">
                  <h2>
                    {{ t('main-overview.detail.meshes.title') }}
                  </h2>

                  <XAction
                    :to="{ name: 'mesh-list-view' }"
                  >
                    {{ t('main-overview.detail.about.view_all') }}
                  </XAction>
                </div>
                <div
                  class="card-actions"
                >
                  <XTeleportSlot name="control-plane-detail-view-mesh-actions" />
                </div>
              </div>

              <MeshInsightsList
                data-testid="meshes-details"
                :items="data.items"
                :storage="me"
              />
            </DataLoader>
          </XCard>
        </XLayout>
      </XLayout>
    </AppView>

    <RouterView
      v-slot="{ Component }"
    >
      <XDrawer
        v-if="route.child()"
        @close="route.replace({
          name: route.name,
        })"
      >
        <component
          :is="Component"
        />
      </XDrawer>
    </RouterView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources as ControlPlaneSources } from '../sources'
import { useControlPlaneStatus, useControlPlaneActionGroup } from '@/app/control-planes'
import { useMeshInsightsList } from '@/app/meshes'
import { sources as MeshSources } from '@/app/meshes/sources'
import { sources as PolicySources } from '@/app/policies/sources'
import { useZoneControlPlanesList } from '@/app/zones'
import { sources as ZoneSources } from '@/app/zones/sources'

const props = defineProps<{ routeName: string }>()

const ControlPlaneStatus = useControlPlaneStatus()
const ControlPlaneActionGroup = useControlPlaneActionGroup()
const ZoneControlPlanesList = useZoneControlPlanesList()
const MeshInsightsList = useMeshInsightsList()
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
