<template>
  <div class="zone-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="zoneIngressOverview === null" />

    <div
      v-else
      class="kcard-border"
    >
      <ZoneIngressDetails :zone-ingress-overview="zoneIngressOverview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ZoneIngressDetails from '../components/ZoneIngressDetails.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ZoneIngressOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const route = useRoute()

const zoneIngressOverview = ref<ZoneIngressOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-ingress-detail-view') {
    loadData()
  }
})

watch(() => route.params.name, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-ingress-detail-view') {
    loadData()
  }
})

start()

function start() {
  loadData()
}

async function loadData() {
  isLoading.value = true
  error.value = null

  const name = route.params.zoneIngress as string

  try {
    zoneIngressOverview.value = await kumaApi.getZoneIngressOverview({ name })
  } catch (err) {
    zoneIngressOverview.value = null

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
