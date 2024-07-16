<template>
  <RouteView
    name="policy-detail-view"
    :params="{
      page: 1,
      size: 50,
      s: '',
      mesh: '',
      policy: '',
      policyPath: '',
      dataPlane: '',
    }"
    v-slot="{ route, t, uri, can, me }"
  >
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes', {
            mesh: route.params.mesh,
            path: route.params.policyPath,
            name: route.params.policy,
          },{
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="data-planes"
              :items="data?.items ?? [undefined]"
            >
              <AppCollection
                :page-number="route.params.page"
                :page-size="route.params.size"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                :total="data?.total"
                :is-selected-row="(row) => row.id === route.params.dataPlane"
                @change="route.update"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <RouterLink
                    data-action
                    :to="{
                      name: 'data-plane-detail-view',
                      params: {
                        dataPlane: item.id,
                      },
                    }"
                  >
                    {{ item.name }}
                  </RouterLink>
                </template>

                <template #namespace="{ row: item }">
                  {{ item.namespace }}
                </template>

                <template #zone="{ row }">
                  <RouterLink
                    v-if="row.zone"
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: row.zone,
                      },
                    }"
                  >
                    {{ row.zone }}
                  </RouterLink>

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'data-plane-detail-view',
                        params: {
                          dataPlane: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
            </DataCollection>
            <RouterView
              v-slot="{ Component }"
            >
              <SummaryView
                v-if="route.child()"
                @close="route.replace({
                  params: {
                    mesh: route.params.mesh,
                  },
                  query: {
                    page: route.params.page,
                    size: route.params.size,
                    s: route.params.s,
                  },
                })"
              >
                <component
                  :is="Component"
                  v-if="typeof data !== 'undefined'"
                  :items="data.items"
                />
              </SummaryView>
            </RouterView>
          </template>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
</script>
