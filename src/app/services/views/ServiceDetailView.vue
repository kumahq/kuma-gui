<template>
  <RouteView
    v-slot="{ route }"
  >
    <RouteTitle
      :title="t('services.routes.item.title', {name: route.params.service})"
    />
    <AppView
      :breadcrumbs="[
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
      <div class="service-details">
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== null"
          :error="error"
        />

        <EmptyBlock v-else-if="item === null" />
        <template
          v-else
        >
          <ServiceSummary
            :service="item"
            :external-service="externalService"
          />
          <template
            v-if="item?.serviceType !== 'external'"
          >
            <DataSource
              v-slot="{data, error: dataplanesError}"
              :src="`/${route.params.mesh}/dataplanes/for/${route.params.service}/of/${props.gatewayType}?page=${props.page}&size=${props.size}&search=${props.search}`"
            >
              <template
                v-for="gateways in [typeof data?.items?.[0].dataplane.networking.gateway === 'undefined']"
                :key="gateways"
              >
                <DataPlaneList
                  data-testid="data-overview-table"
                  :page-number="props.page"
                  :page-size="props.size"
                  :total="data?.total"
                  :items="data?.items"
                  :error="dataplanesError"
                  :gateways="gateways"
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
                    <template
                      v-if="gateways"
                    >
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
                        <template #item-template="{ item: value }">
                          {{ value.label }}
                        </template>
                      </KSelect>
                    </template>
                  </template>
                </DataPlaneList>
              </template>
            </DataSource>
          </template>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KSelect, SelectItem } from '@kong/kongponents'
import { ref } from 'vue'

import ServiceSummary from '../components/ServiceSummary.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import KFilterBar from '@/app/common/KFilterBar.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { ExternalService, ServiceInsight } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'

const kumaApi = useKumaApi()
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

const item = ref<ServiceInsight | null>(null)
const externalService = ref<ExternalService | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

start()

function start() {
  loadData()
}

async function loadData() {
  isLoading.value = true
  error.value = null
  item.value = null
  externalService.value = null

  const mesh = props.mesh as string
  const name = props.service as string

  try {
    item.value = await kumaApi.getServiceInsight({ mesh, name })

    if (item.value.serviceType === 'external') {
      externalService.value = await kumaApi.getExternalServiceByServiceInsightName(mesh, name)
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

</script>
<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
  margin-right: auto;
}
</style>
