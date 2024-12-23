<template>
  <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
  <RouteView
    name="zone-egress-list-view"
    :params="{
      /* page: 1, */
      /* size: me.pageSize, */
      zone: '',
      zoneEgress: '',
    }"
    v-slot="{ route, t, me, uri, can }"
  >
    <RouteTitle
      v-if="can('use zones')"
      :render="false"
      :title="t('zone-egresses.routes.items.title')"
    />
    <AppView
      :docs="t('zone-egresses.href.docs')"
    >
      <template
        v-if="!can('use zones')"
        #title
      >
        <h1>
          <RouteTitle
            :title="t('zone-egresses.routes.items.title')"
          />
        </h1>
      </template>
      <div v-html="t('zone-egresses.routes.items.intro', {}, { defaultMessage: '' })" />
      <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
      <XCard>
        <DataLoader
          :src="uri(sources, `/zone-cps/:name/egresses`, {
            name: route.params.zone || '*',
          }, {
            page: 1,
            size: 100,
          })"
        >
          <template
            #loadable="{ data: egresses }"
          >
            <DataCollection
              type="zone-egresses"
              :items="egresses?.items ?? [undefined]"
              :total="egresses?.total"
              @change="route.update"
            >
              <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
              <AppCollection
                class="zone-egress-collection"
                data-testid="zone-egress-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.socketAddress'), label: 'Address', key: 'socketAddress' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="egresses?.items"
                :is-selected-row="(row) => row.name === route.params.zoneEgress"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    :to="{
                      name: 'zone-egress-summary-view',
                      params: {
                        zone: route.params.zone,
                        zoneEgress: item.id,
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
                    v-if="item.zoneEgress.socketAddress.length > 0"
                    :text="item.zoneEgress.socketAddress"
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
                        name: 'zone-egress-detail-view',
                        params: {
                          zoneEgress: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
              <RouterView
                v-slot="{ Component }"
              >
                <SummaryView
                  v-if="route.child()"
                  @close="route.replace({
                    name: 'zone-egress-list-view',
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
                    v-if="typeof egresses !== 'undefined'"
                    :items="egresses.items"
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
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneOverview } from '@/app/zones/data'
const _props = defineProps<{
  data: ZoneOverview
}>()
</script>
