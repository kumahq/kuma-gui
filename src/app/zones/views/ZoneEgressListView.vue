<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="zone-egress-list-view"
      :params="{
        page: 1,
        size: me.pageSize
      }"
    >
      <AppView>
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-egresses.routes.items.title')"
              :render="true"
            />
          </h1>
        </template>

        <DataSource
          v-slot="{ data, error }: ZoneEgressOverviewCollectionSource"
          :src="`/zone-egress-overviews?page=${route.params.page}&size=${route.params.size}`"
        >
          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="zone-egress-collection"
                data-testid="zone-egress-collection"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Address', key: 'addressPort' },
                  { label: 'Status', key: 'status' },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : undefined"
                :error="error"
                :empty-state-message="t('common.emptyState.message', { type: 'Zone Egresses' })"
                :empty-state-cta-to="t('zone-egresses.href.docs')"
                :empty-state-cta-text="t('common.documentation')"
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
                        <MoreIcon :size="KUI_ICON_SIZE_30" />
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
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { MoreIcon } from '@kong/icons'
import { RouteLocationNamedRaw } from 'vue-router'

import type { ZoneEgressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
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

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
