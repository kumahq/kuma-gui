<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="zone-egress-list-view"
      :params="{
        /* page: 1, */
        /* size: me.pageSize, */
        zone: '',
        zoneEgress: '',
      }"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle
              :title="t('zone-egresses.routes.items.title')"
              :render="true"
            />
          </h2>
        </template>

        <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
        <DataSource
          v-slot="{ data, error }: ZoneEgressOverviewCollectionSource"
          :src="`/zone-cps/${route.params.zone || '*'}/egresses?page=${'1'}&size=${'100'}`"
        >
          <KCard>
            <template #body>
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
                  { label: 'Name', key: 'name' },
                  { label: 'Address', key: 'addressPort' },
                  { label: 'Status', key: 'status' },
                  { label: 'Details', key: 'details', hideLabel: true },
                ]"
                :page-number="1"
                :page-size="100"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : undefined"
                :error="error"
                :empty-state-message="t('common.emptyState.message', { type: 'Zone Egresses' })"
                :empty-state-cta-to="t('zone-egresses.href.docs')"
                :empty-state-cta-text="t('common.documentation')"
                :is-selected-row="(row) => row.name === route.params.zoneEgress"
                :get-detail-route="(row) => ({
                  name: 'zone-egress-detail-view',
                  params: {
                    zoneEgress: row.name,
                  },
                })"
                :get-summary-route="(row) => ({
                  name: 'zone-egress-summary-view',
                  params: {
                    zone: route.params.zone,
                    zoneEgress: row.name,
                  },
                  query: {
                    // TODO: Update page & size once the list endpoint is being filtered by zone
                    page: 1,
                    size: 100,
                  },
                })"
                @change="route.update"
              >
                <template #addressPort="{ rowValue }">
                  <TextWithCopyButton
                    v-if="rowValue"
                    :text="rowValue"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ rowValue }">
                  <StatusBadge
                    v-if="rowValue"
                    :status="rowValue"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>
              </AppCollection>
            </template>
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
                :name="route.params.zoneEgress"
                :zone-egress-overview="data?.items.find((item) => item.name === route.params.zoneEgress)"
              />
            </SummaryView>
          </RouterView>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { type RouteLocationNamedRaw } from 'vue-router'

import type { ZoneEgressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
import { StatusKeyword, ZoneEgressOverview } from '@/types/index.d'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneEgressOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  addressPort: string | undefined
  status: StatusKeyword
}

function transformToTableData(zoneEgressOverviews: ZoneEgressOverview[]): ZoneEgressOverviewTableRow[] {
  return zoneEgressOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-egress-detail-view',
      params: {
        zoneEgress: name,
      },
    }

    const { networking } = entity.zoneEgress

    let addressPort
    if (networking?.address && networking?.port) {
      addressPort = `${networking.address}:${networking.port}`
    }

    const status = getItemStatusFromInsight(entity.zoneEgressInsight ?? {})

    return {
      detailViewRoute,
      name,
      addressPort,
      status,
    }
  })
}
</script>
