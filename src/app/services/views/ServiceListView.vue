<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :page-size="PAGE_SIZE"
        :error="error"
        :is-loading="isLoading"
        :empty-state="EMPTY_STATE"
        :table-data="tableData"
        :table-data-is-empty="tableData.data.length === 0"
        :next="nextUrl"
        @table-action="setActiveServiceInsight"
        @load-data="loadData"
      />
    </template>

    <template #sidebar>
      <ServiceDetails
        v-if="serviceInsight !== null"
        :name="serviceInsight.name"
        :mesh="serviceInsight.mesh"
        :service-type="serviceInsight.serviceType"
      />
    </template>
  </ContentWrapper>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, RouteLocationRaw } from 'vue-router'

import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import ServiceDetails from '../components/ServiceDetails.vue'
import Kuma from '@/services/kuma'
import { STATUS } from '@/consts'
import { ServiceInsight, TableHeader } from '@/types'

const headers: TableHeader[] = [
  { label: 'Service', key: 'name' },
  { label: 'Mesh', key: 'mesh' },
  { label: 'Type', key: 'serviceType' },
  { label: 'Address', key: 'address' },
  { label: 'Status', key: 'status' },
  { label: 'DP proxies (online / total)', key: 'dpProxiesStatus' },
]
const PAGE_SIZE = 50

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no service insights present.',
}

const route = useRoute()

const isLoading = ref(true)
const error = ref<Error | null>(null)
const nextUrl = ref<string | null>(null)
const serviceInsight = ref<{ name: string, mesh: string, serviceType?: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated' } | null>(null)
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

loadData(0)

async function loadData(offset: number): Promise<void> {
  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string
  const size = PAGE_SIZE

  try {
    const { items = [], next } = await Kuma.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    nextUrl.value = next

    if (Array.isArray(items) && items.length > 0) {
      items.sort((itemA, itemB) => {
        if (itemA.name > itemB.name) {
          return 1
        } else if (itemA.name < itemB.name) {
          return -1
        } else {
          return itemA.mesh.localeCompare(itemB.mesh)
        }
      })
      setActiveServiceInsight(items[0])
      tableData.value.data = items.map((item) => processItem(item))
    } else {
      serviceInsight.value = null
      tableData.value.data = []
    }
  } catch (err) {
    serviceInsight.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

type ProcessedServiceInsight = Pick<ServiceInsight, 'name' | 'mesh' | 'serviceType' | 'addressPort'> & {
  nameRoute: RouteLocationRaw
  meshRoute: RouteLocationRaw
  dpProxiesStatus: string
  status: string
}

function processItem(serviceInsight: ServiceInsight): ProcessedServiceInsight {
  const nameRoute = {
    name: serviceInsight.serviceType === 'external' ? 'external-service-detail-view' : 'service-insight-detail-view',
    params: {
      mesh: serviceInsight.mesh,
      service: serviceInsight.name,
    },
  }
  const meshRoute = {
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

  let status = '—'
  if (serviceInsight.status) {
    status = STATUS[serviceInsight.status].title
  }

  const serviceType = serviceInsight.serviceType ?? 'internal'

  return {
    ...serviceInsight,
    serviceType,
    nameRoute,
    meshRoute,
    dpProxiesStatus,
    status,
  }
}

function setActiveServiceInsight(activeServiceInsight: typeof serviceInsight.value): void {
  serviceInsight.value = activeServiceInsight
}
</script>
