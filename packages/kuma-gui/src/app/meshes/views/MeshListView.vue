<template>
  <RouteView
    name="mesh-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      s: '',
    }"
    v-slot="{ route, t, me, uri, can }"
  >
    <DataSource
      :src="uri(sources, `/mesh-insights`, {}, {
        page: route.params.page,
        size: route.params.size,
        search: route.params.s,
      })"
      v-slot="{ data, error, refresh }"
    >
      <AppView
        :docs="data?.items.length ? t('meshes.href.docs'):''"
      >
        <template #title>
          <h1>
            <RouteTitle
              :title="t('meshes.routes.items.title')"
            />
          </h1>
        </template>

        <XI18n
          v-if="!can('view growth-new-empty-states') || data?.items.length"
          path="meshes.routes.items.intro"
          default-path="common.i18n.ignore-error"
        />
        <XTeleportTemplate
          v-if="(data?.items ?? []).length > 0"
          :to="{ name: 'mesh-list-view-actions'}"
        >
          <MeshActionGroup />
        </XTeleportTemplate>

        <XCard>
          <XLayout>
            <search>
              <form @submit.prevent>
                <XSearch
                  class="search-field"
                  :keys="['name']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :data="[data]"
              :errors="[error]"
              variant="list"
            >
              <DataCollection
                type="meshes"
                :items="data?.items ?? [undefined]"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="data?.total"
                @change="route.update"
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
                  :items="data?.items"
                  :is-selected-row="(row) => row.name === route.params.mesh"
                  @resize="me.set"
                >
                  <template
                    #name="{ row: item }"
                  >
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

                  <template
                    #services="{ row: item }"
                  >
                    {{ item.services.internal }}
                  </template>

                  <template
                    #dataplanes="{ row: item }"
                  >
                    {{ item.dataplanesByType.standard.online }} / {{ item.dataplanesByType.standard.total }}
                  </template>
                  <template
                    #actions="{ row: item }"
                  >
                    <MeshActionGroup
                      :item="item"
                      @change="refresh"
                    >
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
                    </MeshActionGroup>
                  </template>
                </AppCollection>
              </DataCollection>
            </DataLoader>
          </XLayout>
        </XCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { useMeshActionGroup } from '../'
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const MeshActionGroup = useMeshActionGroup()
</script>
<style lang="scss" scoped>
.search-field {
  width: 100%;
}
</style>
