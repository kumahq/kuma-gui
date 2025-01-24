<template>
  <RouteView
    name="builtin-gateway-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      gateway: '',
    }"
    v-slot="{ route, t, can, me, uri }"
  >
    <AppView
      :docs="t('builtin-gateways.href.docs')"
    >
      <XCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/mesh-gateways`, {
            mesh: route.params.mesh,
          }, {
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="gateways"
              :items="data?.items ?? [undefined]"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="route.update"
            >
              <AppCollection
                class="builtin-gateway-collection"
                data-testid="builtin-gateway-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XCopyButton
                    :text="item.name"
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'builtin-gateway-summary-view',
                        query: {
                          size: route.params.size,
                          page: route.params.page,
                        },
                        params: {
                          mesh: item.mesh,
                          gateway: item.id,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </XCopyButton>
                </template>

                <template #zone="{ row }">
                  <template v-if="row.labels && row.labels['kuma.io/origin'] === 'zone' && row.labels['kuma.io/zone']">
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.labels['kuma.io/zone'],
                        },
                      }"
                    >
                      {{ row.labels['kuma.io/zone'] }}
                    </XAction>
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'builtin-gateway-detail-view',
                        params: {
                          mesh: item.mesh,
                          gateway: item.name,
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
              v-if="route.child()"
              v-slot="{ Component }"
            >
              <SummaryView
                @close="route.replace({
                  name: 'builtin-gateway-list-view',
                  params: {
                    mesh: route.params.mesh,
                  },
                  query: {
                    page: route.params.page,
                    size: route.params.size,
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
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
</script>
