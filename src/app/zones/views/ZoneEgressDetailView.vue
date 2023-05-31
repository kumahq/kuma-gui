<template>
  <div class="zone-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <EmptyBlock v-else-if="zoneEgressOverview === null" />

    <div
      v-else
      class="kcard-border"
    >
      <ZoneEgressDetails :zone-egress-overview="zoneEgressOverview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ZoneEgressDetails from '../components/ZoneEgressDetails.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const route = useRoute()

const zoneEgressOverview = ref<ZoneEgressOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-egress-detail-view') {
    loadData()
  }
})

watch(() => route.params.name, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name === 'zone-egress-detail-view') {
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

  const name = route.params.zoneEgress as string

  try {
    zoneEgressOverview.value = await kumaApi.getZoneEgressOverview({ name })
  } catch (err) {
    zoneEgressOverview.value = null

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
