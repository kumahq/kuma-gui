<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, can, t }"
      name="gateway-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        gatewayType: 'all',
        query: '',
        s: '',
        mesh: '',
        dataPlane: '',
      }"
    >
      <DataSource
        v-slot="{data, error}: GatewayCollectionSource"
        :src="`/meshes/${route.params.mesh}/gateways/of/${route.params.gatewayType}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('gateways.routes.items.title')"
                :render="true"
              />
            </h2>
          </template>

          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <DataPlaneList
                v-else
                data-testid="gateway-collection"
                class="gateway-collection"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data?.items"
                :error="error"
                :gateways="true"
                :is-selected-row="(row) => row.name === route.params.dataPlane"
                summary-route-name="gateway-summary-view"
                @change="({page, size}) => {
                  route.update({
                    page: String(page),
                    size: String(size),
                  })
                }"
              >
                <template #toolbar>
                  <FilterBar
                    class="data-plane-proxy-filter"
                    :placeholder="`tag: 'kuma.io/protocol: http'`"
                    :query="route.params.query"
                    :fields="{
                      name: { description: 'filter by name or parts of a name' },
                      service: { description: 'filter by “kuma.io/service” value' },
                      tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                      ...( can('use zones') ? {
                        zone: { description: 'filter by “kuma.io/zone” value' },
                      } : {}),
                    }"
                    @fields-change="(val) => route.update({
                      query: val.query,
                      s: val.query.length > 0 ? JSON.stringify(val.fields) : '',
                    })"
                  />
                  <KSelect
                    label="Type"
                    :overlay-label="true"
                    :items="[
                      {
                        label: 'All',
                        value: 'all',
                      },
                      {
                        label: 'Builtin',
                        value: 'builtin',
                      },
                      {
                        label: 'Delegated',
                        value: 'delegated',
                      },
                    ].map(item => ({
                      ...item,
                      selected: item.value === route.params.gatewayType,
                    }))"
                    appearance="select"
                    @selected="(item: SelectItem) => route.update({
                      gatewayType: String(item.value),
                    })"
                  >
                    <template #item-template="{ item }">
                      {{ item.label }}
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
                name: 'gateway-list-view',
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
import type { GatewayCollectionSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import type { MeSource } from '@/app/me/sources'
import type { SelectItem } from '@kong/kongponents'

</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}
</style>
