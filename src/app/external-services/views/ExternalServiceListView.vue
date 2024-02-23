<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="external-service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: ExternalServiceCollectionSource"
        :src="`/meshes/${route.params.mesh}/external-services?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <AppCollection
              v-else
              class="external-service-collection"
              data-testid="external-service-collection"
              :empty-state-message="t('common.emptyState.message', { type: 'External Services' })"
              :empty-state-cta-to="t('external-services.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Address', key: 'address' },
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
                      name: 'external-service-detail-view',
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

              <template #address="{ row }">
                <TextWithCopyButton
                  v-if="row.networking.address"
                  :text="row.networking.address"
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
                    name: 'external-service-detail-view',
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
          </KCard>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { ExternalServiceCollectionSource } from '../sources'
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
