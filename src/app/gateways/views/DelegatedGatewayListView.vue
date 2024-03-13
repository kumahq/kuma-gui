<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="delegated-gateway-list-view"
      :params="{
        page: 1,
        size: 10,
        mesh: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: ServiceInsightCollectionSource"
        :src="`/meshes/${route.params.mesh}/service-insights/of/gateway_delegated?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <AppCollection
              v-else
              class="delegated-gateway-collection"
              data-testid="delegated-gateway-collection"
              :empty-state-message="t('common.emptyState.message', { type: 'Delegated Gateways' })"
              :empty-state-cta-to="t('delegated-gateways.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Address', key: 'addressPort' },
                { label: 'DP proxies (online / total)', key: 'dataplanes' },
                { label: 'Status', key: 'status' },
                { label: 'Details', key: 'details', hideLabel: true },
              ]"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              @change="route.update"
            >
              <template #name="{ row: item }">
                <TextWithCopyButton :text="item.name">
                  <RouterLink
                    :to="{
                      name: 'delegated-gateway-detail-view',
                      params: {
                        mesh: item.mesh,
                        service: item.name,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                      },
                    }"
                  >
                    {{ item.name }}
                  </RouterLink>
                </TextWithCopyButton>
              </template>

              <template #addressPort="{ row }">
                <TextWithCopyButton
                  v-if="row.addressPort"
                  :text="row.addressPort"
                />

                <template v-else>
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template #dataplanes="{ row }">
                <template v-if="row.dataplanes">
                  {{ row.dataplanes.online || 0 }} / {{ row.dataplanes.total || 0 }}
                </template>

                <template v-else>
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template #status="{ row }">
                <StatusBadge :status="row.status" />
              </template>

              <template #details="{ row }">
                <RouterLink
                  class="details-link"
                  data-testid="details-link"
                  :to="{
                    name: 'delegated-gateway-detail-view',
                    params: {
                      mesh: row.mesh,
                      service: row.name,
                    },
                  }"
                >
                  {{ t('common.collection.details_link') }}

                  <ArrowRightIcon
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                </RouterLink>
              </template>
            </AppCollection>
          </KCard>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
import type { ServiceInsightCollectionSource } from '@/app/services/sources'
</script>

<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
