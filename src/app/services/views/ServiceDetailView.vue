<template>
  <div class="service-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="service === null" />

    <ServiceDetails
      v-else
      :service="service"
      :data-plane-overviews="dataPlaneOverviews"
      :external-service="externalService"
      :dpp-filter-fields="DPP_FILTER_FIELDS"
      :selected-dpp-name="props.selectedDppName"
      @load-dataplane-overviews="loadDataplaneOverviews"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { DataPlaneOverview, ExternalService, ServiceInsight } from '@/types/index.d'
import { DataPlaneOverviewParameters } from '@/types/api.d'
import { FilterFields } from '@/app/common/KFilterBar.vue'
import { QueryParameter } from '@/utilities/QueryParameter'
import { useStore } from '@/store/store'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ServiceDetails from '../components/ServiceDetails.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const DPP_FILTER_FIELDS: FilterFields = {
  name: { description: 'filter by name or parts of a name' },
  protocol: { description: 'filter by “kuma.io/protocol” value' },
  tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
  zone: { description: 'filter by “kuma.io/zone” value' },
}

const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedDppName: {
    type: String,
    required: false,
    default: null,
  },
})

const service = ref<ServiceInsight | null>(null)
const externalService = ref<ExternalService | null>(null)
const dataPlaneOverviews = ref<DataPlaneOverview[] | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'service-detail-view') {
    return
  }

  loadData(0)
})

watch(() => route.params.name, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'service-detail-view') {
    return
  }

  loadData(0)
})

function start() {
  store.dispatch('updatePageTitle', route.params.service)

  const filterFields = QueryParameter.get('filterFields')
  const dppParams = filterFields !== null ? JSON.parse(filterFields) as DataPlaneOverviewParameters : {}

  loadData(0, dppParams)
}

start()

async function loadData(offset: number, dppParams: DataPlaneOverviewParameters = {}) {
  isLoading.value = true
  error.value = null
  service.value = null
  externalService.value = null
  dataPlaneOverviews.value = null

  const mesh = route.params.mesh as string
  const name = route.params.service as string

  try {
    service.value = await kumaApi.getServiceInsight({ mesh, name })

    if (service.value.serviceType === 'external') {
      externalService.value = await kumaApi.getExternalServiceByServiceInsightName(mesh, name)
    } else {
      await loadDataplaneOverviews(offset, dppParams)
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

async function loadDataplaneOverviews(offset: number, dppParams: DataPlaneOverviewParameters): Promise<void> {
  const mesh = route.params.mesh as string
  const name = route.params.service as string

  try {
    const params = getDataPlaneOverviewParameters(name, offset, dppParams)
    const dataPlaneOverviewsResponse = await kumaApi.getAllDataplaneOverviewsFromMesh({ mesh }, params)
    dataPlaneOverviews.value = dataPlaneOverviewsResponse.items ?? []
  } catch (err) {
    dataPlaneOverviews.value = null
  }
}

function getDataPlaneOverviewParameters(name: string, offset: number, dppParams: DataPlaneOverviewParameters): DataPlaneOverviewParameters {
  const size = 50
  const serviceTag = `kuma.io/service:${name}`

  const params: DataPlaneOverviewParameters = {
    ...dppParams,
    offset,
    size,
  }

  // Prunes any service tags from the received parameters because this view always looks-up DPPs by its own service tag
  if (params.tag) {
    const tags = Array.isArray(params.tag) ? params.tag : [params.tag]
    const serviceTagIndexes = []

    for (const [index, tag] of tags.entries()) {
      if (tag.startsWith('kuma.io/service:')) {
        serviceTagIndexes.push(index)
      }
    }

    for (let i = serviceTagIndexes.length - 1; i === 0; i--) {
      tags.splice(serviceTagIndexes[i], 1)
    }

    params.tag = tags.concat(serviceTag)
  } else {
    params.tag = serviceTag
  }

  return params
}
</script>
