<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :selected-entity-name="service?.name"
        :page-size="PAGE_SIZE"
        :error="error"
        :is-loading="isLoading"
        :empty-state="EMPTY_STATE"
        :table-data="tableData"
        :table-data-is-empty="tableData.data.length === 0"
        :next="nextUrl"
        :page-offset="pageOffset"
        @table-action="loadService"
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
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, RouteLocationRaw, RouteLocationNamedRaw } from 'vue-router'

import { ExternalService, ServiceInsight, TableHeader } from '@/types/index.d'
import { kumaApi } from '@/api/kumaApi'
import { QueryParameter } from '@/utilities/QueryParameter'
import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import ServiceSummary from '../components/ServiceSummary.vue'

const headers: TableHeader[] = [
  { label: 'Service', key: 'name' },
  { label: 'Type', key: 'serviceType' },
  { label: 'Address', key: 'addressPort' },
  { label: 'Status', key: 'status' },
  { label: 'DP proxies (online / total)', key: 'dpProxiesStatus' },
]
const PAGE_SIZE = 50

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
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers,
  data: [],
})

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'service-list-view') {
    return
  }

  loadData(0)
})

loadData(props.offset)

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string
  const size = PAGE_SIZE

  try {
    const { items, next } = await kumaApi.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    nextUrl.value = next

    if (Array.isArray(items) && items.length > 0) {
      items.sort((itemA, itemB) => {
        if (itemA.name > itemB.name) {
          return 1
        } else if (itemA.name < itemB.name) {
          return -1
        }
        return 0
      })

      tableData.value.data = items.map((item) => processItem(item))

      const activeServiceName = props.selectedServiceName ?? items[0].name
      await loadService({ name: activeServiceName, mesh })
    } else {
      tableData.value.data = []
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

type ProcessedServiceInsight = Pick<ServiceInsight, 'name' | 'mesh' | 'serviceType' | 'addressPort' | 'status'> & {
  nameRoute: RouteLocationRaw
  meshRoute: RouteLocationRaw
  dpProxiesStatus: string
}

function processItem(serviceInsight: ServiceInsight): ProcessedServiceInsight {
  const nameRoute: RouteLocationNamedRaw = {
    name: 'service-detail-view',
    params: {
      mesh: serviceInsight.mesh,
      service: serviceInsight.name,
    },
  }
  const meshRoute: RouteLocationNamedRaw = {
    name: 'mesh-detail-view',
    params: {
      mesh: serviceInsight.mesh,
    },
  }

  let dpProxiesStatus = '—'
  if (serviceInsight.dataplanes) {
    const { online = 0, total = 0 } = serviceInsight.dataplanes
    dpProxiesStatus = `${online} / ${total}`
  }

  const addressPort = serviceInsight.addressPort
  const serviceType = serviceInsight.serviceType ?? 'internal'

  return {
    ...serviceInsight,
    serviceType,
    nameRoute,
    meshRoute,
    dpProxiesStatus,
    addressPort,
  }
}

async function loadService({ mesh, name }: { mesh: string, name: string }): Promise<void> {
  service.value = await kumaApi.getServiceInsight({ mesh, name })

  if (service.value.serviceType === 'external') {
    externalService.value = await kumaApi.getExternalService({ mesh, name })
  }

  QueryParameter.set('service', name)
}
</script>
