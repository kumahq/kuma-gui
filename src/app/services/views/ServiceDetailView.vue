<template>
  <RouteView
    v-slot="{ route }"
    name="service-detail-view"
    data-testid="service-detail-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'services-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('services.routes.item.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('services.routes.item.title', {name: route.params.service})"
            :render="true"
          />
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ServiceInsightSource"
        :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
      >
        <LoadingBlock v-if="data === undefined" />

        <ErrorBlock
          v-else-if="error"
          :error="error"
        />

        <TabsWidget
          v-else
          :tabs="getTabs(data)"
        >
          <template #overview>
            <DataSource
              v-if="data.serviceType === 'external'"
              v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
              :src="`/meshes/${route.params.mesh}/external-services/${route.params.service}`"
            >
              <LoadingBlock v-if="externalService === undefined" />

              <ErrorBlock
                v-else-if="externalServiceError"
                :error="externalServiceError"
              />

              <ExternalServiceDetails
                v-else
                :service-insight="data"
                :external-service="externalService"
              />
            </DataSource>

            <ServiceInsightDetails
              v-else
              :service-insight="data"
            />
          </template>

          <template
            v-if="data.serviceType !== 'external'"
            #dataPlaneProxies
          >
            <h2 class="mb-4">
              {{ t('services.routes.item.tabs.data_plane_proxies') }}
            </h2>

            <DataSource
              v-slot="{ data: dataplanesData, error: dataplanesError }"
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
          </template>
        </TabsWidget>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard, KSelect, SelectItem } from '@kong/kongponents'

import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import type { ExternalServiceSource, ServiceInsightSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import KFilterBar from '@/app/common/KFilterBar.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import type { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
  search: string
  query: string
  //
  gatewayType: string
  mesh: string
  service: string
}>()

function getTabs(serviceInsight: ServiceInsight) {
  const tabs = [
    {
      hash: '#overview',
      title: t('services.routes.item.tabs.overview'),
    },
  ]

  // All non-external service types have Data Plane Proxies
  if (serviceInsight.serviceType !== 'external') {
    tabs.push({
      hash: '#dataPlaneProxies',
      title: t('services.routes.item.tabs.data_plane_proxies'),
    })
  }

  return tabs
}
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}
</style>
