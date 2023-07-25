<template>
  <RouteView
    v-slot="{ route }"
    name="zone-egress-list-view"
  >
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
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-egresses.routes.items.title')"
            :render="true"
          />
        </h2>
      </template>

      <DataSource
        v-slot="{ data, error }: ZoneEgressOverviewCollectionSource"
        :src="`/zone-egresses?size=${props.size}&page=${props.page}`"
      >
        <KCard>
          <template #body>
            <AppCollection
              class="zone-egress-collection"
              data-testid="zone-egress-collection"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Status', key: 'status' },
                { label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="props.page"
              :page-size="props.size"
              :total="data?.total"
              :items="data ? transformToTableData(data.items) : undefined"
              :error="error"
              @change="route.update"
            >
              <template #name="{ row, rowValue }">
                <RouterLink
                  :to="row.detailViewRoute"
                  data-testid="detail-view-link"
                >
                  {{ rowValue }}
                </RouterLink>
              </template>

              <template #status="{ rowValue }">
                <StatusBadge
                  v-if="rowValue"
                  :status="rowValue"
                />

                <template v-else>
                  —
                </template>
              </template>

              <template #actions="{ row }">
                <KDropdownMenu
                  class="actions-dropdown"
                  data-testid="actions-dropdown"
                  :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
                  width="150"
                >
                  <template #default>
                    <KButton
                      class="non-visual-button"
                      appearance="secondary"
                      size="small"
                    >
                      <template #icon>
                        <KIcon
                          color="var(--black-400)"
                          icon="more"
                          size="16"
                        />
                      </template>
                    </KButton>
                  </template>

                  <template #items>
                    <KDropdownItem
                      :item="{
                        to: row.detailViewRoute,
                        label: t('common.collection.actions.view'),
                      }"
                    />
                  </template>
                </KDropdownMenu>
              </template>
            </AppCollection>
          </template>
        </KCard>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KButton, KCard, KDropdownItem, KDropdownMenu, KIcon } from '@kong/kongponents'
import { RouteLocationNamedRaw } from 'vue-router'

import type { ZoneEgressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { StatusKeyword, ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneEgressOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword
}

const { t } = useI18n()

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
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-egress-detail-view',
      params: {
        zoneEgress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneEgressInsight ?? {})

    return {
      detailViewRoute,
      name,
      status,
    }
  })
}
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>

<style lang="scss">
.zone-egress-collection {
  .actions-column {
    width: 5%;
    min-width: 80px;
    text-align: end;
  }

  .status-column {
    width: 10%;
    min-width: 200px;
  }
}
</style>
