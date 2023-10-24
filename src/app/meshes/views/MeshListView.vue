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
        size: me.pageSize
      }"
    >
      <DataSource
        v-slot="{data, error}: MeshInsightCollectionSource"
        :src="`/meshes?page=${route.params.page}&size=${route.params.size}`"
      >
        <AppView>
          <template #title>
            <h1>
              <RouteTitle
                :title="t('meshes.routes.items.title')"
                :render="true"
              />
            </h1>
          </template>
          <div class="stack">
            <KCard>
              <template #body>
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
                    { label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :page-number="parseInt(route.params.page)"
                  :page-size="parseInt(route.params.size)"
                  :total="data?.total"
                  :items="data?.items"
                  :error="error"
                  :empty-state-message="t('common.emptyState.message', { type: 'Meshes' })"
                  :empty-state-cta-to="t('meshes.href.docs')"
                  :empty-state-cta-text="t('common.documentation')"
                  @change="route.update"
                >
                  <template #name="{ row: item }">
                    <RouterLink
                      :to="{
                        name: 'mesh-detail-view',
                        params: {
                          mesh: item.name,
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
                  <template #actions="{ row: item }">
                    <KDropdownMenu
                      class="actions-dropdown"
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
                            to: {
                              name: 'mesh-detail-view',
                              params: {
                                mesh: item.name,
                              },
                            },
                            label: t('common.collection.actions.view'),
                          }"
                        />
                      </template>
                    </KDropdownMenu>
                  </template>
                </AppCollection>
              </template>
            </KCard>
          </div>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { MoreIcon } from '@kong/icons'

import type { MeshInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
