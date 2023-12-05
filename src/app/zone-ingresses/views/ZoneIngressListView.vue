<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="zone-ingress-list-view"
      :params="{
        /* page: 1, */
        /* size: me.pageSize, */
        zone: '',
        zoneIngress: '',
      }"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle
              :title="t('zone-ingresses.routes.items.title')"
            />
          </h2>
        </template>

        <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
        <DataSource
          v-slot="{ data, error }: ZoneIngressOverviewCollectionSource"
          :src="`/zone-cps/${route.params.zone}/ingresses?page=${'1'}&size=${'100'}`"
        >
          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <!-- TODO: Update page & size once the list endpoint is being filtered by zone -->
            <AppCollection
              v-else
              class="zone-ingress-collection"
              data-testid="zone-ingress-collection"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Address', key: 'addressPort' },
                { label: 'Advertised address', key: 'advertisedAddressPort' },
                { label: 'Status', key: 'status' },
                { label: 'Details', key: 'details', hideLabel: true },
              ]"
              :page-number="1"
              :page-size="100"
              :total="data?.total"
              :items="data ? transformToTableData(data.items) : undefined"
              :error="error"
              :empty-state-message="t('common.emptyState.message', { type: 'Zone Ingresses' })"
              :empty-state-cta-to="t('zone-ingresses.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :is-selected-row="(row) => row.name === route.params.zoneIngress"
              @change="route.update"
            >
              <template #name="{ row }">
                <RouterLink
                  :to="{
                    name: 'zone-ingress-summary-view',
                    params: {
                      zone: route.params.zone,
                      zoneIngress: row.name,
                    },
                    query: {
                      // TODO: Update page & size once the list endpoint is being filtered by zone
                      page: 1,
                      size: 100,
                    },
                  }"
                >
                  {{ row.name }}
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

              <template #details="{ row }">
                <RouterLink
                  class="details-link"
                  data-testid="details-link"
                  :to="{
                    name: 'zone-ingress-detail-view',
                    params: {
                      zoneIngress: row.name,
                    },
                  }"
                >
                  {{ t('common.collection.details_link') }}

                  <ArrowRightIcon
                    display="inline-block"
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                </RouterLink>
              </template>
            </AppCollection>
          </KCard>

          <RouterView
            v-if="route.params.zoneIngress"
            v-slot="child"
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
                :is="child.Component"
                :name="route.params.zoneIngress"
                :zone-ingress-overview="data?.items.find((item) => item.name === route.params.zoneIngress)"
              />
            </SummaryView>
          </RouterView>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'
import { type RouteLocationNamedRaw } from 'vue-router'

import type { ZoneIngressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
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
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
