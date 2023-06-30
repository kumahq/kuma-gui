<template>
  <RouteView>
    <RouteTitle
      :title="t('services.routes.items.title')"
    />
    <AppView>
      <ContentWrapper>
        <template #content>
          <DataOverview
            :selected-entity-name="service?.name"
            :page-size="PAGE_SIZE_DEFAULT"
            :error="error"
            :is-loading="isLoading"
            :empty-state="EMPTY_STATE"
            :table-data="tableData"
            :table-data-is-empty="tableData.data.length === 0"
            :next="nextUrl"
            :page-offset="pageOffset"
            @table-action="loadEntity"
            @load-data="loadData"
          />
        </template>

        <template #sidebar>
          <ServiceSummary
            v-if="service !== null"
            :service="service"
            :external-service="externalService"
          />
        </template>
      </ContentWrapper>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, RouteLocationNamedRaw } from 'vue-router'

import ServiceSummary from '../components/ServiceSummary.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { ExternalService, ServiceInsight, TableHeader } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

type ServiceInsightTableRow = Required<Pick<ServiceInsight, 'serviceType' | 'addressPort' | 'status'>> & {
  entity: ServiceInsight
  detailViewRoute: RouteLocationNamedRaw
  dpProxiesStatus: string
}

const kumaApi = useKumaApi()
const { t } = useI18n()

const headers: TableHeader[] = [
  { label: 'Name', key: 'entity' },
  { label: 'Type', key: 'serviceType' },
  { label: 'Address', key: 'addressPort' },
  { label: 'Status', key: 'status' },
  { label: 'DP proxies (online / total)', key: 'dpProxiesStatus' },
]
const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no service insights present.',
}

const route = useRoute()

const props = defineProps({
  selectedServiceName: {
    type: String,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)
const service = ref<ServiceInsight | null>(null)
const externalService = ref<ExternalService | null>(null)
const tableData = ref<{ headers: TableHeader[], data: ServiceInsightTableRow[] }>({
  headers,
  data: [],
})

loadData(props.offset)

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string
  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllServiceInsightsFromMesh({ mesh }, { size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedServiceName ?? tableData.value.data[0]?.entity.name, mesh })
  } catch (err) {
    tableData.value.data = []
    service.value = null
    externalService.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(serviceInsights: ServiceInsight[]): ServiceInsightTableRow[] {
  return serviceInsights.map((serviceInsight) => {
    const { serviceType = 'internal', addressPort = '', status = 'not_available' } = serviceInsight
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'service-detail-view',
      params: {
        mesh: serviceInsight.mesh,
        service: serviceInsight.name,
      },
    }

    let dpProxiesStatus = '—'
    if (serviceInsight.dataplanes) {
      const { online = 0, total = 0 } = serviceInsight.dataplanes
      dpProxiesStatus = `${online} / ${total}`
    }

    return {
      entity: serviceInsight,
      detailViewRoute,
      status,
      serviceType,
      dpProxiesStatus,
      addressPort,
    }
  })
}

async function loadEntity({ name, mesh }: { name?: string | undefined, mesh: string }) {
  if (name !== undefined) {
    service.value = await kumaApi.getServiceInsight({ mesh, name })

    if (service.value.serviceType === 'external') {
      externalService.value = await kumaApi.getExternalServiceByServiceInsightName(mesh, name)
    }

    QueryParameter.set('service', name)
  } else {
    service.value = null
    externalService.value = null
    QueryParameter.set('service', null)
  }
}
</script>
