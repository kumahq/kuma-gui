<template>
  <RouteView
    v-slot="{ route }"
    name="mesh-list-view"
  >
    <DataSource
      v-slot="{data, error}: MeshCollectionSource"
      :src="`/meshes?page=${props.page}&size=${props.size}`"
    >
      <AppView
        :breadcrumbs="[
          {
            to: {
              name: 'mesh-list-view'
            },
            text: t('meshes.routes.items.breadcrumbs')
          }
        ]"
      >
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
              <AppCollection
                class="mesh-collection"
                data-testid="mesh-collection"
                :empty-state-title="t('common.emptyState.title')"
                :empty-state-message="t('common.emptyState.message', { type: 'Meshes' })"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="props.page"
                :page-size="props.size"
                :total="data?.total"
                :items="data?.items"
                :error="error"
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
                        <template #icon>
                          <KIcon
                            color="var(--black-400)"
                            icon="more"
                            size="16"
                          />
                        </template>
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
</template>

<script lang="ts" setup>
import { KCard, KDropdownMenu, KDropdownItem, KButton, KIcon } from '@kong/kongponents'

import { MeshCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
}>()
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
