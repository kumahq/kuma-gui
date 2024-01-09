<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="data-plane-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        query: '',
        dataplaneType: 'all',
        s: '',
        mesh: '',
        dataPlane: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: DataplaneOverviewCollectionSource"
        :src="`/meshes/${route.params.mesh}/dataplanes/of/${route.params.dataplaneType}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('data-planes.routes.items.title')"
              />
            </h2>
          </template>

          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />
            <DataPlaneList
              v-else
              data-testid="data-plane-collection"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              :is-selected-row="(row) => row.name === route.params.dataPlane"
              summary-route-name="data-plane-summary-view"
              @change="route.update"
            >
              <template #toolbar>
                <FilterBar
                  class="data-plane-proxy-filter"
                  :placeholder="`tag: 'kuma.io/service: backend'`"
                  :query="route.params.query"
                  :fields="{
                    name: { description: 'filter by name or parts of a name' },
                    protocol: { description: 'filter by “kuma.io/protocol” value' },
                    service: { description: 'filter by “kuma.io/service” value' },
                    tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                    zone: { description: 'filter by “kuma.io/zone” value' },
                  }"
                  @fields-change="route.update({
                    query: $event.query,
                    s: $event.query.length > 0 ? JSON.stringify($event.fields) : '',
                  })"
                />

                <KSelect
                  class="filter-select"
                  label="Type"
                  :items="['all', 'standard', 'builtin', 'delegated'].map((value) => ({
                    value,
                    label: t(`data-planes.type.${value}`),
                    selected: value === route.params.dataplaneType,
                  }))"
                  appearance="select"
                  @selected="route.update({ dataplaneType: String($event.value) })"
                >
                  <template #item-template="{ item: value }">
                    {{ value.label }}
                  </template>
                </KSelect>
              </template>
            </DataPlaneList>
          </KCard>

          <RouterView
            v-if="route.params.dataPlane"
            v-slot="child"
          >
            <SummaryView
              @close="route.replace({
                name: 'data-plane-list-view',
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
                :name="route.params.dataPlane"
                :dataplane-overview="data?.items.find((item) => item.name === route.params.dataPlane)"
              />
            </SummaryView>
          </RouterView>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import DataPlaneList from '../components/DataPlaneList.vue'
import type { DataplaneOverviewCollectionSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: $kui-space-40;
}

.filter-select :deep(.k-label) {
  // Removes the bottom margin as we’re aligning the label with the select in a horizontal layout.
  margin-bottom: 0 !important;
}
</style>
