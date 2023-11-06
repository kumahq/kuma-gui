<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ can, route, t }"
      name="service-data-plane-proxies-view"
      :params="{
        page: 1,
        size: me.pageSize,
        query: '',
        dataplaneType: 'all',
        s: '',
        mesh: '',
        service: '',
        dataPlane: '',
      }"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle
              :title="t('services.routes.item.navigation.service-data-plane-proxies-view')"
            />
          </h2>
        </template>

        <DataSource
          v-slot="{ data: dataplanesData, error: dataplanesError }: DataPlaneCollectionSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/for/${route.params.service}/of/${route.params.dataplaneType}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
        >
          <KCard>
            <template #body>
              <ErrorBlock
                v-if="dataplanesError !== undefined"
                :error="dataplanesError"
              />

              <DataPlaneList
                v-else
                data-testid="data-plane-collection"
                class="data-plane-collection"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="dataplanesData?.total"
                :items="dataplanesData?.items"
                :error="dataplanesError"
                :is-selected-row="(row) => row.name === route.params.dataPlane"
                summary-route-name="service-data-plane-summary-view"
                :can-use-zones="can('use zones')"
                @change="route.update"
              >
                <template #toolbar>
                  <FilterBar
                    class="data-plane-proxy-filter"
                    :placeholder="`tag: 'kuma.io/protocol: http'`"
                    :query="route.params.query"
                    :fields="{
                      name: { description: 'filter by name or parts of a name' },
                      protocol: { description: 'filter by “kuma.io/protocol” value' },
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
            </template>
          </KCard>

          <RouterView
            v-if="route.params.dataPlane"
            v-slot="child"
          >
            <SummaryView
              @close="route.replace({
                name: 'service-data-plane-proxies-view',
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
                :dataplane-overview="dataplanesData?.items.find((item) => item.name === route.params.dataPlane)"
              />
            </SummaryView>
          </RouterView>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { DataPlaneCollectionSource } from '@/app/data-planes/sources'
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
