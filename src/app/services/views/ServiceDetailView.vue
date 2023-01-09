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
      :selected-dpp-name="props.selectedDppName"
      @load-data="loadData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { DataPlaneOverview, ExternalService, ServiceInsight } from '@/types/index.d'
import { kumaApi } from '@/api/kumaApi'
import { useStore } from '@/store/store'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ServiceDetails from '../components/ServiceDetails.vue'

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

  loadData()
})

watch(() => route.params.name, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'service-detail-view') {
    return
  }

  loadData()
})

store.dispatch('updatePageTitle', route.params.service)
loadData()

async function loadData() {
  isLoading.value = true
  error.value = null
  service.value = null
  externalService.value = null
  dataPlaneOverviews.value = null

  const mesh = route.params.mesh as string
  const name = route.params.service as string
  const tag = `kuma.io/service:${name}`
  const gateway = false

  try {
    service.value = await kumaApi.getServiceInsight({ mesh, name })

    if (service.value.serviceType === 'external') {
      externalService.value = await kumaApi.getExternalService({ mesh, name })
    } else {
      const dataPlaneOverviewsResponse = await kumaApi.getAllDataplaneOverviewsFromMesh({ mesh }, { gateway, tag })
      dataPlaneOverviews.value = dataPlaneOverviewsResponse.items ?? []
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
