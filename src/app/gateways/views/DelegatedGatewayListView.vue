<template>
  <RouteView
    v-slot="{ route, t, me }"
    name="delegated-gateway-list-view"
    :params="{
      page: 1,
      size: 50,
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
              { ...me.get('headers.name'), label: 'Name', key: 'name' },
              { ...me.get('headers.addressPort'), label: 'Address', key: 'addressPort' },
              { ...me.get('headers.dataplanes'), label: 'DP proxies (online / total)', key: 'dataplanes' },
              { ...me.get('headers.status'), label: 'Status', key: 'status' },
              { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :page-number="route.params.page"
            :page-size="route.params.size"
            :total="data?.total"
            :items="data?.items"
            :error="error"
            @change="route.update"
            @resize="me.set"
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

            <template #actions="{ row: item }">
              <XActionGroup>
                <XAction
                  :to="{
                    name: 'delegated-gateway-detail-view',
                    params: {
                      mesh: item.mesh,
                      service: item.name,
                    },
                  }"
                >
                  {{ t('common.collection.actions.view') }}
                </XAction>
              </XActionGroup>
            </template>
          </AppCollection>
        </KCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ServiceInsightCollectionSource } from '@/app/services/sources'
</script>
