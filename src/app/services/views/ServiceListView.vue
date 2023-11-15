<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        service: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: ServiceInsightCollectionSource"
        :src="`/meshes/${route.params.mesh}/service-insights?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('services.routes.items.title')"
              />
            </h2>
          </template>

          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="service-collection"
                data-testid="service-collection"
                :empty-state-message="t('common.emptyState.message', { type: 'Services' })"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Type', key: 'serviceType' },
                  { label: 'Address', key: 'addressPort' },
                  { label: 'DP proxies (online / total)', key: 'online' },
                  { label: 'Status', key: 'status' },
                  { label: 'Details', key: 'details', hideLabel: true },
                ]"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data?.items"
                :error="error"
                :is-selected-row="(row) => row.name === route.params.service"
                @change="route.update"
              >
                <template #name="{ row: item }">
                  <RouterLink
                    :to="{
                      name: 'service-detail-view',
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
                </template>

                <template #serviceType="{ rowValue }">
                  {{ rowValue || 'internal' }}
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

                <template #online="{ row: item }">
                  <template
                    v-if="item.dataplanes"
                  >
                    {{ item.dataplanes.online || 0 }} / {{ item.dataplanes.total || 0 }}
                  </template>
                  <template
                    v-else
                  >
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row: item }">
                  <StatusBadge :status="item.status || 'not_available'" />
                </template>

                <template #details="{ row }">
                  <RouterLink
                    class="details-link"
                    data-testid="details-link"
                    :to="{
                      name: 'service-detail-view',
                      params: {
                        mesh: row.mesh,
                        service: row.name,
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
            </template>
          </KCard>

          <RouterView
            v-if="route.params.service"
            v-slot="child"
          >
            <SummaryView
              @close="route.replace({
                name: 'service-list-view',
                params: {
                  mesh: route.params.mesh,
                },
                query: {
                  page: route.params.page,
                  size: route.params.size,
                },
              })"
            >
              <component
                :is="child.Component"
                :name="route.params.service"
                :service="data?.items.find((item) => item.name === route.params.service)"
              />
            </SummaryView>
          </RouterView>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { ServiceInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
