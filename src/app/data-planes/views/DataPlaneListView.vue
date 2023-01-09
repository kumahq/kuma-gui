<template>
  <DataPlaneList
    :data-plane-overviews="dataPlaneOverviews"
    :is-loading="isLoading"
    :error="error"
    :next-url="nextUrl"
    :page-offset="pageOffset"
    :selected-dpp-name="props.selectedDppName"
    :is-gateway-view="props.isGatewayView"
    @gateway-type-change="($event) => loadData(0, $event)"
    @load-data="loadData"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { patchQueryParam } from '@/utilities/patchQueryParam'
import { kumaApi } from '@/api/kumaApi'
import { DataPlaneOverview } from '@/types/index.d'
import DataPlaneList from '../components/DataPlaneList.vue'

const PAGE_SIZE = 50
// Depending on what dataplane types we are viewing send the correct params to the API
const GATEWAY_TYPES = {
  All: true,
  Builtin: 'builtin',
  Delegated: 'delegated',
} as const

const route = useRoute()
const props = defineProps({
  selectedDppName: {
    type: String,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },

  isGatewayView: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const dataPlaneOverviews = ref<DataPlaneOverview[]>([])

const isLoading = ref(true)
const error = ref<Error | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'data-plane-list-view' && route.name !== 'gateway-list-view') {
    return
  }

  loadData(0)
})

loadData(props.offset)

async function loadData(offset: number, gatewayType: keyof typeof GATEWAY_TYPES = 'All'): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  patchQueryParam('offset', offset > 0 ? offset : null)

  isLoading.value = true

  const mesh = route.params.mesh as string
  const size = PAGE_SIZE

  try {
    const gateway = !props.isGatewayView ? false : GATEWAY_TYPES[gatewayType]

    const { items, next } = await kumaApi.getAllDataplaneOverviewsFromMesh({ mesh }, { size, offset, gateway })

    if (Array.isArray(items) && items.length > 0) {
      dataPlaneOverviews.value = items
      nextUrl.value = next
    } else {
      dataPlaneOverviews.value = []
      nextUrl.value = null
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }

    dataPlaneOverviews.value = []
    nextUrl.value = null
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.table-header-selector-item .k-dropdown-item-trigger {
  // Removes the paddings from the dropdown items so that the items are interactive for their full visual size.
  padding: 0 !important;
}
</style>
