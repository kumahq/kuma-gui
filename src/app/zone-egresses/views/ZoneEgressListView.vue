<template>
  <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
  <RouteView
    v-slot="{ route, t, me }"
    name="zone-egress-list-view"
    :params="{
      /* page: 1, */
      /* size: me.pageSize, */
      zone: '',
      zoneEgress: '',
    }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-egresses.routes.items.title')"
    />
    <AppView>
      <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
      <DataSource
        v-slot="{ data, error }: ZoneEgressOverviewCollectionSource"
        :src="`/zone-cps/${route.params.zone || '*'}/egresses?page=${'1'}&size=${'100'}`"
      >
        <KCard>
          <ErrorBlock
            v-if="error !== undefined"
            :error="error"
          />

          <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
          <AppCollection
            v-else
            class="zone-egress-collection"
            data-testid="zone-egress-collection"
            :headers="[
              { ...me.get('headers.name'), label: 'Name', key: 'name' },
              { ...me.get('headers.socketAddress'), label: 'Address', key: 'socketAddress' },
              { ...me.get('headers.status'), label: 'Status', key: 'status' },
              { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :page-number="1"
            :page-size="100"
            :total="data?.total"
            :items="data?.items"
            :error="error"
            :empty-state-message="t('common.emptyState.message', { type: 'Zone Egresses' })"
            :empty-state-cta-to="t('zone-egresses.href.docs')"
            :empty-state-cta-text="t('common.documentation')"
            :is-selected-row="(row) => row.name === route.params.zoneEgress"
            @change="route.update"
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
        </KCard>

        <RouterView
          v-if="route.params.zoneEgress"
          v-slot="child"
        >
          <SummaryView
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
              :is="child.Component"
              v-if="typeof data !== 'undefined'"
              :items="data.items"
            />
          </SummaryView>
        </RouterView>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
