<template>
  <RouteView
    v-slot="{ route }"
    name="zone-egress-list-view"
  >
    <RouteTitle :title="t('zone-egresses.routes.items.title')" />

    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-egress-list-view',
          },
          text: t('zone-egresses.routes.items.breadcrumbs')
        },
      ]"
    >
      <DataSource
        v-slot="{ data: zoneEgressOverviewData, error }: ZoneEgressOverviewCollectionSource"
        :src="`/zones/zone-egresses?size=${props.size}&page=${props.page}`"
      >
        <KCard>
          <template #body>
            <AppCollection
              data-testid="zone-egress-table"
              :headers="HEADERS"
              :page-number="props.page"
              :page-size="props.size"
              :total="zoneEgressOverviewData?.total"
              :items="zoneEgressOverviewData ? transformToTableData(zoneEgressOverviewData.items) : []"
              :error="error"
              @change="route.update"
            >
              <template #name="{ row }">
                <RouterLink
                  :to="row.detailViewRoute"
                  data-testid="detail-view-link"
                >
                  {{ row.name }}
                </RouterLink>
              </template>

              <template #status="{ row }">
                <StatusBadge
                  v-if="row.status"
                  :status="row.status"
                />

                <template v-else>
                  —
                </template>
              </template>
            </AppCollection>
          </template>
        </KCard>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { RouteLocationNamedRaw } from 'vue-router'

import type { ZoneEgressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { StatusKeyword, TableHeader, ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneEgressOverviewTableRow = {
  id: string
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword
}

const { t } = useI18n()

const HEADERS: TableHeader[] = [
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
]

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },
})

function transformToTableData(zoneEgressOverviews: ZoneEgressOverview[]): ZoneEgressOverviewTableRow[] {
  return zoneEgressOverviews.map((entity) => {
    const { name } = entity
    const id = name
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-egress-detail-view',
      params: {
        zoneEgress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneEgressInsight ?? {})

    return {
      id,
      detailViewRoute,
      name,
      status,
    }
  })
}
</script>
