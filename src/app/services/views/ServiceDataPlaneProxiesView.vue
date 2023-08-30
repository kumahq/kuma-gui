<template>
  <RouteView
    v-slot="{ route }"
    name="service-data-plane-proxies-view"
    data-testid="service-data-plane-proxies-view"
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
        :src="`/meshes/${route.params.mesh}/dataplanes/for/${route.params.service}/of/${props.gatewayType}?page=${props.page}&size=${props.size}&search=${props.search}`"
      >
        <template
          v-for="gateways in [typeof dataplanesData?.items?.[0]?.dataplane?.networking?.gateway === 'undefined']"
          :key="gateways"
        >
          <KCard>
            <template #body>
              <DataPlaneList
                data-testid="data-plane-collection"
                class="data-plane-collection"
                :page-number="props.page"
                :page-size="props.size"
                :total="dataplanesData?.total"
                :items="dataplanesData?.items"
                :error="dataplanesError"
                :gateways="gateways"
                @change="({page, size}) => {
                  route.update({
                    page: String(page),
                    size: String(size)
                  })
                }"
              >
                <template #toolbar>
                  <KFilterBar
                    class="data-plane-proxy-filter"
                    :placeholder="`tag: 'kuma.io/protocol: http'`"
                    :query="props.query"
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
                      selected: item.value === props.gatewayType
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
</template>

<script lang="ts" setup>
import { KCard, KSelect, SelectItem } from '@kong/kongponents'

import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import KFilterBar from '@/app/common/KFilterBar.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { DataPlaneCollectionSource } from '@/app/data-planes/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
  search: string
  query: string
  gatewayType: string
}>()
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}
</style>
