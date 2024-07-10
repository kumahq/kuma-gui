<template>
  <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
  <RouteView
    v-slot="{ route, t, me, uri }"
    name="zone-ingress-list-view"
    :params="{
      /* page: 1, */
      /* size: me.pageSize, */
      zone: '',
      zoneIngress: '',
    }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.items.title')"
    />
    <AppView
      :docs="t('zone-ingresses.href.docs')"
    >
      <div v-html="t('zone-ingresses.routes.items.intro', {}, { defaultMessage: '' })" />
      <KCard>
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
            #loadable="{ data }"
          >
            <DataCollection
              type="zone-ingresses"
              :items="data?.items ?? [undefined]"
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
                :page-number="1"
                :page-size="100"
                :total="data?.total"
                :items="data?.items"
                :is-selected-row="(row) => row.name === route.params.zoneIngress"
                @change="route.update"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    :to="{
                      name: 'zone-ingress-summary-view',
                      params: {
                        zone: route.params.zone,
                        zoneIngress: item.id,
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
                  <TextWithCopyButton
                    v-if="item.zoneIngress.socketAddress.length > 0"
                    :text="item.zoneIngress.socketAddress"
                  />
                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #advertisedSocketAddress="{ row: item }">
                  <TextWithCopyButton
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
                          zoneIngress: item.id,
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
                    v-if="typeof data !== 'undefined'"
                    :items="data.items"
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </template>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
