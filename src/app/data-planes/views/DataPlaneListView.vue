<template>
  <RouteView
    :module="props.isGatewayView ? 'gateways' : 'data-planes'"
  >
    <RouteTitle
      :title="t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.items.title`)"
    />
    <AppView>
      <DataPlaneList
        :data-plane-overviews="dataPlaneOverviews"
        :is-loading="isLoading"
        :error="error"
        :next-url="nextUrl"
        :page-offset="pageOffset"
        :selected-dpp-name="props.selectedDppName"
        :is-gateway-view="props.isGatewayView"
        :gateway-type="props.gatewayType"
        :dpp-filter-fields="dppFilterFields"
        @load-data="loadData"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import DataPlaneList from '../components/DataPlaneList.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { FilterFields } from '@/app/common/KFilterBar.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { DataPlaneOverviewParameters } from '@/types/api'
import { DataPlaneOverview } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()
const { t } = useI18n()

const BASE_FILTER_FIELDS: FilterFields = {
  name: { description: 'filter by name or parts of a name' },
  service: { description: 'filter by “kuma.io/service” value' },
  tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
  zone: { description: 'filter by “kuma.io/zone” value' },
}

const DPP_FILTER_FIELDS: FilterFields = {
  protocol: { description: 'filter by “kuma.io/protocol” value' },
}

const GATEWAY_FILTER_FIELDS: FilterFields = {}

const route = useRoute()
const props = defineProps({
  selectedDppName: {
    type: String,
    required: false,
    default: null,
  },

  gatewayType: {
    type: String,
    required: false,
    default: 'true',
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
const dppFilterFields = computed(() => {
  return {
    ...BASE_FILTER_FIELDS,
    ...(props.isGatewayView ? GATEWAY_FILTER_FIELDS : DPP_FILTER_FIELDS),
  }
})

function start() {
  const filterFields = QueryParameter.get('filterFields')
  const dppParams = filterFields !== null ? JSON.parse(filterFields) as DataPlaneOverviewParameters : {}

  loadData(props.offset, {
    ...dppParams,
    gateway: props.gatewayType,
  } as DataPlaneOverviewParameters)
}

start()

async function loadData(offset: number, dppParams: DataPlaneOverviewParameters = {}): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)
  QueryParameter.set('gatewayType', dppParams.gateway === 'true' ? 'all' : dppParams.gateway)
  isLoading.value = true

  const mesh = route.params.mesh as string
  const params = getDataplaneOverviewParameters(dppParams, PAGE_SIZE_DEFAULT, offset, props.isGatewayView)

  try {
    const { items, next } = await kumaApi.getAllDataplaneOverviewsFromMesh({ mesh }, params)

    nextUrl.value = next
    dataPlaneOverviews.value = items ?? []
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

function getDataplaneOverviewParameters(dppParams: DataPlaneOverviewParameters, size: number, offset: number, isGatewayView: boolean): DataPlaneOverviewParameters {
  const params: DataPlaneOverviewParameters = {
    ...dppParams,
    size,
    offset,
  }

  if (isGatewayView && (!('gateway' in params) || params.gateway === 'false')) {
    params.gateway = 'true'
  } else if (!isGatewayView) {
    params.gateway = 'false'
  }

  return params
}
</script>

<style lang="scss">
.table-header-selector-item .k-dropdown-item-trigger {
  // Removes the paddings from the dropdown items so that the items are interactive for their full visual size.
  padding: 0 !important;
}
</style>
