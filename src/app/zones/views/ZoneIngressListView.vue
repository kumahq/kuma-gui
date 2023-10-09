<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, can, t }"
      name="zone-ingress-list-view"
      :params="{
        page: 1,
        size: me.pageSize
      }"
    >
      <AppView>
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-ingresses.routes.items.title')"
              :render="true"
            />
          </h1>
        </template>
        <MultizoneInfo v-if="!can('use zones')" />

        <template v-else>
          <DataSource
            v-slot="{ data, error }: ZoneIngressOverviewCollectionSource"
            :src="`/zone-ingress-overviews?page=${route.params.page}&size=${route.params.size}`"
          >
            <KCard>
              <template #body>
                <ErrorBlock
                  v-if="error !== undefined"
                  :error="error"
                />

                <AppCollection
                  v-else
                  class="zone-ingress-collection"
                  data-testid="zone-ingress-collection"
                  :headers="[
                    { label: 'Name', key: 'name' },
                    { label: 'Address', key: 'addressPort' },
                    { label: 'Advertised address', key: 'advertisedAddressPort' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :page-number="parseInt(route.params.page)"
                  :page-size="parseInt(route.params.size)"
                  :total="data?.total"
                  :items="data ? transformToTableData(data.items) : undefined"
                  :error="error"
                  :empty-state-message="t('common.emptyState.message', { type: 'Zone Ingresses' })"
                  :empty-state-cta-to="t('zone-ingresses.href.docs')"
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

                  <template #advertisedAddressPort="{ rowValue }">
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
        </template>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { MoreIcon } from '@kong/icons'
import { RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import type { ZoneIngressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
import { StatusKeyword, ZoneIngressOverview } from '@/types/index.d'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneIngressOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  addressPort: string | undefined
  advertisedAddressPort: string | undefined
  status: StatusKeyword
}

function transformToTableData(zoneIngressOverviews: ZoneIngressOverview[]): ZoneIngressOverviewTableRow[] {
  return zoneIngressOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-ingress-detail-view',
      params: {
        zoneIngress: name,
      },
    }

    const { networking } = entity.zoneIngress

    let addressPort
    if (networking?.address && networking?.port) {
      addressPort = `${networking.address}:${networking.port}`
    }

    let advertisedAddressPort
    if (networking?.advertisedAddress && networking?.advertisedPort) {
      advertisedAddressPort = `${networking.advertisedAddress}:${networking.advertisedPort}`
    }

    const status = getItemStatusFromInsight(entity.zoneIngressInsight ?? {})

    return {
      detailViewRoute,
      name,
      addressPort,
      advertisedAddressPort,
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
