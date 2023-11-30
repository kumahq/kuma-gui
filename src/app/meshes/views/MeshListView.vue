<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="mesh-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: MeshInsightCollectionSource"
        :src="`/mesh-insights?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <template #title>
            <h1>
              <RouteTitle
                :title="t('meshes.routes.items.title')"
              />
            </h1>
          </template>

          <div class="stack">
            <KCard>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="mesh-collection"
                data-testid="mesh-collection"
                :headers="[
                  { label: t('meshes.common.name'), key: 'name' },
                  { label: t('meshes.routes.items.collection.services'), key: 'services'},
                  { label: t('meshes.routes.items.collection.dataplanes'), key: 'dataplanes'},
                  { label: 'Details', key: 'details', hideLabel: true },
                ]"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data?.items"
                :error="error"
                :empty-state-message="t('common.emptyState.message', { type: 'Meshes' })"
                :empty-state-cta-to="t('meshes.href.docs')"
                :empty-state-cta-text="t('common.documentation')"
                :is-selected-row="(row) => row.name === route.params.mesh"
                @change="route.update"
              >
                <template #name="{ row: item }">
                  <RouterLink
                    :to="{
                      name: 'mesh-detail-view',
                      params: {
                        mesh: item.name,
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

                <template #services="{ row: item }">
                  {{ item.services.internal ?? '0' }}
                </template>

                <template #dataplanes="{ row: item }">
                  {{ item.dataplanesByType.standard.online ?? '0' }} / {{ item.dataplanesByType.standard.total ?? '0' }}
                </template>

                <template #details="{ row }">
                  <RouterLink
                    class="details-link"
                    data-testid="details-link"
                    :to="{
                      name: 'mesh-detail-view',
                      params: {
                        mesh: row.name,
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
              v-if="route.params.mesh"
              v-slot="child"
            >
              <SummaryView
                @close="route.replace({
                  name: 'mesh-list-view',
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
                  :name="route.params.mesh"
                  :mesh-insight="data?.items.find((item) => item.name === route.params.mesh)"
                />
              </SummaryView>
            </RouterView>
          </div>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { MeshInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
