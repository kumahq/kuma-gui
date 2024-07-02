<template>
  <RouteView
    v-slot="{ route, t, me }"
    name="mesh-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
    }"
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
          <DataLoader
            v-slot="{ data, error }: MeshInsightCollectionSource"
            :src="`/mesh-insights?page=${route.params.page}&size=${route.params.size}`"
            :loader="false"
          >
            <AppCollection
              class="mesh-collection"
              data-testid="mesh-collection"
              :headers="[
                { ...me.get('headers.name'), label: t('meshes.common.name'), key: 'name' },
                { ...me.get('headers.services'), label: t('meshes.routes.items.collection.services'), key: 'services'},
                { ...me.get('headers.dataplanes'), label: t('meshes.routes.items.collection.dataplanes'), key: 'dataplanes'},
                { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              :empty-state-message="t('common.emptyState.message', { type: 'Meshes' })"
              :empty-state-cta-to="t('meshes.href.docs')"
              :empty-state-cta-text="t('common.documentation')"
              :is-selected-row="(row) => row.name === route.params.mesh"
              @change="route.update"
              @resize="me.set"
            >
              <template #name="{ row: item }">
                <XAction
                  data-action
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
                </XAction>
              </template>

              <template #services="{ row: item }">
                {{ item.services.internal }}
              </template>

              <template #dataplanes="{ row: item }">
                {{ item.dataplanesByType.standard.online }} / {{ item.dataplanesByType.standard.total }}
              </template>
              <template #actions="{ row: item }">
                <XActionGroup>
                  <XAction
                    :to="{
                      name: 'mesh-detail-view',
                      params: {
                        mesh: item.name,
                      },
                    }"
                  >
                    {{ t('common.collection.actions.view') }}
                  </XAction>
                </XActionGroup>
              </template>
            </AppCollection>
          </DataLoader>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
</script>
