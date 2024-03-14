<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can }"
      name="builtin-gateway-list-view"
      :params="{
        page: 1,
        size: 10,
        mesh: '',
        gateway: '',
      }"
    >
      <DataSource
        v-slot="{ data, error }: MeshGatewayCollectionSource"
        :src="`/meshes/${route.params.mesh}/mesh-gateways?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <AppCollection
              v-else
              class="builtin-gateway-collection"
              data-testid="builtin-gateway-collection"
              :empty-state-message="t('common.emptyState.message', { type: 'Built-in Gateways' })"
              :empty-state-cta-to="t('builtin-gateways.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :headers="[
                { label: 'Name', key: 'name' },
                ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
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
                      name: 'builtin-gateway-detail-view',
                      params: {
                        mesh: item.mesh,
                        gateway: item.name,
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

              <template #zone="{ row }">
                <template v-if="row.labels && row.labels['kuma.io/origin'] === 'zone' && row.labels['kuma.io/zone']">
                  <RouterLink
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: row.labels['kuma.io/zone'],
                      },
                    }"
                  >
                    {{ row.labels['kuma.io/zone'] }}
                  </RouterLink>
                </template>

                <template v-else>
                  {{ t('common.detail.none') }}
                </template>
              </template>

              <template #details="{ row }">
                <RouterLink
                  class="details-link"
                  data-testid="details-link"
                  :to="{
                    name: 'builtin-gateway-detail-view',
                    params: {
                      mesh: row.mesh,
                      gateway: row.name,
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

import type { MeshGatewayCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
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
