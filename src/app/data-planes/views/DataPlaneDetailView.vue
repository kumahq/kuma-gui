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
import { useStore } from '@/store/store'
import Kuma from '@/services/kuma'
import DataPlaneDetails from '../components/DataPlaneDetails.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

const route = useRoute()
const store = useStore()

const dataPlane = ref<DataPlane | null>(null)
const dataPlaneOverview = ref<DataPlaneOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

async function loadData() {
  error.value = null
  isLoading.value = true

  const mesh = route.params.mesh as string
  const name = route.params.dataPlane as string

  try {
    dataPlane.value = await Kuma.getDataplaneFromMesh({ mesh, name })
    dataPlaneOverview.value = await Kuma.getDataplaneOverviewFromMesh({ mesh, name })
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

watch(() => route.params.dataPlane, function () {
  if (route.name === 'data-plane-detail-view') {
    loadData()
  }
})

loadData()

store.dispatch('updatePageTitle', route.params.dataPlane)
</script>
