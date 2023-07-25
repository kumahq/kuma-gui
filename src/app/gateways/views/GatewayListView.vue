<template>
  <RouteView
    v-slot="{ route }"
    name="gateways-list-view"
  >
    <DataSource
      v-slot="{data, error}: GatewayCollectionSource"
      :src="`/${route.params.mesh}/gateways/of/${props.gatewayType}?page=${props.page}&size=${size}&search=${props.search}`"
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
            <DataPlaneList
              data-testid="gateway-collection"
              class="gateway-collection"
              :page-number="props.page"
              :page-size="props.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              :gateways="true"
              @change="({page, size}) => {
                // @TODO: Should we remove s: undefined?
                route.update({
                  page: String(page),
                  size: String(size)
                })
              }"
            >
              <template #toolbar>
                <KFilterBar
                  data-testid="gateway-type-filter"
                  class="data-plane-proxy-filter"
                  :placeholder="`tag: 'kuma.io/protocol: http'`"
                  :query="props.query"
                  :fields="{
                    name: { description: 'filter by name or parts of a name' },
                    service: { description: 'filter by “kuma.io/service” value' },
                    tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                    zone: { description: 'filter by “kuma.io/zone” value' },
                  }"
                  @fields-change="(val) => route.update({
                    query: val.query,
                    s: val.query.length > 0 ? JSON.stringify(val.fields) : ''
                  })"
                />
                <KSelect
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
                  <template #item-template="{ item }">
                    {{ item.label }}
                  </template>
                </KSelect>
              </template>
            </DataPlaneList>
          </template>
        </KCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import {
  KCard,
  KSelect,
  SelectItem,
} from '@kong/kongponents'

import { GatewayCollectionSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import KFilterBar from '@/app/common/KFilterBar.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
  search: string
  query: string
  //
  mesh: string
  gatewayType: string
}>()
</script>
<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
  margin-right: auto;
}
</style>
<style lang="scss">
.gateway-collection {
  .actions-column {
    width: 5%;
    min-width: 80px;
    text-align: end;
  }
  .status-column {
    width: 10%;
    min-width: 200px;
  }
}
</style>
