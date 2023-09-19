<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="service-data-plane-proxies-view"
      data-testid="service-data-plane-proxies-view"
      :params="{
        page: 1,
        size: me.pageSize,
        query: '',
        s: ''
      }"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle
              :title="t('services.routes.item.navigation.service-data-plane-proxies-view')"
              :render="true"
            />
          </h2>
        </template>

        <DataSource
          v-slot="{ data: dataplanesData, error: dataplanesError }: DataPlaneCollectionSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/for/${route.params.service}/of/${'all'}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
        >
          <template
            v-for="gateways in [typeof dataplanesData?.items?.[0]?.dataplane?.networking?.gateway === 'undefined']"
            :key="gateways"
          >
            <KCard>
              <template #body>
                {{ route.params.size }}
                <DataPlaneList
                  data-testid="data-plane-collection"
                  class="data-plane-collection"
                  :page-number="parseInt(route.params.page)"
                  :page-size="parseInt(route.params.size)"
                  :total="dataplanesData?.total"
                  :items="dataplanesData?.items"
                  :error="dataplanesError"
                  :gateways="gateways"
                  @change="route.update"
                >
                  <template #toolbar>
                    <KFilterBar
                      class="data-plane-proxy-filter"
                      :placeholder="`tag: 'kuma.io/protocol: http'`"
                      :query="route.params.query"
                      :fields="{
                        name: { description: 'filter by name or parts of a name' },
                        protocol: { description: 'filter by “kuma.io/protocol” value' },
                        tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                        zone: { description: 'filter by “kuma.io/zone” value' },
                      }"
                      @fields-change="(val) => route.update({
                        query: val.query,
                        s: val.query.length > 0 ? JSON.stringify(val.fields) : ''
                      })"
                    />

                    <KSelect
                      v-if="gateways"
                      label="Type"
                      :overlay-label="true"
                      :items="[
                        {
                          label: 'All',
                          value: 'all'
                        },
                        {
                          label: 'Builtin',
                          value: 'builtin'
                        },
                        {
                          label: 'Delegated',
                          value: 'delegated'
                        }
                      ].map(item => ({
                        ...item,
                        selected: item.value === route.params.gatewayType
                      }))"
                      appearance="select"
                      @selected="(item: SelectItem) => route.update({
                        gatewayType: String(item.value),
                      })"
                    >
                      <template #item-template="{ item: value }">
                        {{ value.label }}
                      </template>
                    </KSelect>
                  </template>
                </DataPlaneList>
              </template>
            </KCard>
          </template>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import KFilterBar from '@/app/common/KFilterBar.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { DataPlaneCollectionSource } from '@/app/data-planes/sources'
import type { MeSource } from '@/app/me/sources'
import type { SelectItem } from '@kong/kongponents'
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}
</style>
