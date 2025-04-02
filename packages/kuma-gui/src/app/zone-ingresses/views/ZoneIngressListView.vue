<template>
  <RouteView
    name="zone-ingress-list-view"
    :params="{
      page: 1,
      size: Number,
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
        <DataLoader
          :src="uri(sources, `/zone-cps/:name/ingresses`, {
            name: route.params.zone,
          }, {
            page: route.params.page,
            size: route.params.size,
          })"
          variant="list"
          v-slot="{ data }"
        >
          <DataCollection
            type="zone-ingresses"
            :items="data.items"
            :page="route.params.page"
            :page-size="route.params.size"
            :total="data.total"
            @change="route.update"
          >
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
              :items="data.items"
              :is-selected-row="(row) => row.name === route.params.proxy"
              @resize="me.set"
            >
              <template
                #name="{ row: item }"
              >
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
                      page: route.params.page,
                      size: route.params.size,
                    },
                  }"
                >
                  {{ item.name }}
                </XAction>
              </template>

              <template
                #socketAddress="{ row: item }"
              >
                <XCopyButton
                  v-if="item.zoneIngress.socketAddress.length > 0"
                  :text="item.zoneIngress.socketAddress"
                />
                <template
                  v-else
                >
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template
                #advertisedSocketAddress="{ row: item }"
              >
                <XCopyButton
                  v-if="item.zoneIngress.advertisedSocketAddress.length > 0"
                  :text="item.zoneIngress.advertisedSocketAddress"
                />
                <template
                  v-else
                >
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template
                #status="{ row: item }"
              >
                <StatusBadge
                  :status="item.state"
                />
              </template>

              <template
                #actions="{ row: item }"
              >
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
                    page: route.params.page,
                    size: route.params.size,
                  },
                })"
              >
                <component
                  :is="Component"
                  :items="data.items"
                />
              </SummaryView>
            </RouterView>
          </DataCollection>
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
</script>
