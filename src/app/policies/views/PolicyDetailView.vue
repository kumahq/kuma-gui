<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, uri, can }"
      name="policy-detail-view"
      :params="{
        mesh: '',
        policy: '',
        policyPath: '',
        dataPlane: '',
        s: '',
        page: 1,
        size: me.pageSize,
      }"
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
                    { label: 'Name', key: 'name' },
                    { label: 'Namespace', key: 'namespace' },
                    ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                    { label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="data?.items"
                  :total="data?.total"
                  :is-selected-row="(row) => row.id === route.params.dataPlane"
                  @change="route.update"
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
  </DataSource>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { MeSource } from '@/app/me/sources'
</script>
