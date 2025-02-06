<template>
  <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
  <RouteView
    name="zone-ingress-list-view"
    :params="{
      /* page: 1, */
      /* size: me.pageSize, */
      zone: '',
      proxy: '',
    }"
    v-slot="{ route, t, me, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.items.title')"
    />
    <AppView
      :docs="t('zone-ingresses.href.docs')"
    >
      <XI18n
        path="zone-ingresses.routes.items.intro"
        default-path="common.i18n.ignore-error"
      />
      <XCard>
        <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
        <DataLoader
          :src="uri(sources, `/zone-cps/:name/ingresses`, {
            name: route.params.zone,
          }, {
            page: 1,
            size: 100,
          })"
        >
          <template
            #loadable="{ data: ingresses }"
          >
            <DataCollection
              type="zone-ingresses"
              :items="ingresses?.items ?? [undefined]"
              :total="ingresses?.total"
              @change="route.update"
            >
              <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
              <AppCollection
                class="zone-ingress-collection"
                data-testid="zone-ingress-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.socketAddress'), label: 'Address', key: 'socketAddress' },
                  { ...me.get('headers.advertisedSocketAddress'), label: 'Advertised address', key: 'advertisedSocketAddress' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="ingresses?.items"
                :is-selected-row="(row) => row.name === route.params.proxy"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    :to="{
                      name: 'zone-ingress-summary-view',
                      params: {
                        zone: route.params.zone,
                        proxy: item.id,
                        proxyType: 'ingresses',
                      },
                      query: {
                        // TODO: Update page & size once the list endpoint is being filtered by zone
                        page: 1,
                        size: 100,
                      },
                    }"
                  >
                    {{ item.name }}
                  </XAction>
                </template>

                <template #socketAddress="{ row: item }">
                  <XCopyButton
                    v-if="item.zoneIngress.socketAddress.length > 0"
                    :text="item.zoneIngress.socketAddress"
                  />
                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #advertisedSocketAddress="{ row: item }">
                  <XCopyButton
                    v-if="item.zoneIngress.advertisedSocketAddress.length > 0"
                    :text="item.zoneIngress.advertisedSocketAddress"
                  />
                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row: item }">
                  <StatusBadge
                    :status="item.state"
                  />
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'zone-ingress-detail-view',
                        params: {
                          proxy: item.id,
                          proxyType: 'ingresses',
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>

              <RouterView
                v-if="route.child()"
                v-slot="{ Component }"
              >
                <SummaryView
                  @close="route.replace({
                    name: 'zone-ingress-list-view',
                    params: {
                      zone: route.params.zone,
                    },
                    query: {
                      // TODO: Update page & size once the list endpoint is being filtered by zone
                      page: 1,
                      size: 100,
                    },
                  })"
                >
                  <component
                    :is="Component"
                    v-if="typeof ingresses !== 'undefined'"
                    :items="ingresses.items"
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </template>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { ZoneOverview } from '@/app/zones/data'
const _props = defineProps<{
  data: ZoneOverview
}>()
</script>
