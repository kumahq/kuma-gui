<template>
  <div class="component-frame">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="dataPlane === null || dataPlaneOverview === null" />

    <DataPlaneDetails
      v-else
      :data-plane="dataPlane"
      :data-plane-overview="dataPlaneOverview"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { DataPlane, DataPlaneOverview } from '@/types'
import Kuma from '@/services/kuma'
import DataPlaneDetails from '../components/DataPlaneDetails.vue'
import EmptyBlock from '@/components/EmptyBlock.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'

const route = useRoute()

const dataPlane = ref<DataPlane | null>(null)
const dataPlaneOverview = ref<DataPlaneOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

// TODO: Support this being `{ gateway: false }` for showing only standard data planes.
const dataPlaneApiParams = {}

async function loadData() {
  error.value = null
  isLoading.value = true

  const mesh = route.params.mesh as string
  const dataPlaneName = route.params.dataPlane as string
  const params = dataPlaneApiParams

  try {
    dataPlane.value = await Kuma.getDataplaneFromMesh({ mesh, name: dataPlaneName }, params)
    dataPlaneOverview.value = await Kuma.getDataplaneOverviewFromMesh({ mesh, name: dataPlaneName }, params)
  } catch (err) {
    dataPlane.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.mesh, function () {
  if (route.name === 'data-plane-detail-view') {
    loadData()
  }
})

loadData()
</script>
