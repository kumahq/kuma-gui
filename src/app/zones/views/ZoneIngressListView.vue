<template>
  <RouteView
    v-slot="{ route }"
    name="zone-ingress-list-view"
  >
    <RouteTitle :title="t('zone-ingresses.routes.items.title')" />

    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-ingress-list-view',
          },
          text: t('zone-ingresses.routes.items.breadcrumbs')
        },
      ]"
    >
      <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

      <template v-else>
        <DataSource
          v-slot="{ data, error }: ZoneIngressOverviewCollectionSource"
          :src="`/zone-ingresses?size=${props.size}&page=${props.page}`"
        >
          <KCard>
            <template #body>
              <AppCollection
                data-testid="zone-ingress-table"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Status', key: 'status' },
                ]"
                :page-number="props.page"
                :page-size="props.size"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : []"
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
      </template>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import type { ZoneIngressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { useStore } from '@/store/store'
import { StatusKeyword, ZoneIngressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneIngressOverviewTableRow = {
  id: string
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword
}

const { t } = useI18n()
const store = useStore()

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

function transformToTableData(zoneIngressOverviews: ZoneIngressOverview[]): ZoneIngressOverviewTableRow[] {
  return zoneIngressOverviews.map((entity) => {
    const { name } = entity
    const id = name
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-ingress-detail-view',
      params: {
        zoneIngress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneIngressInsight ?? {})

    return {
      id,
      detailViewRoute,
      name,
      status,
    }
  })
}
</script>
