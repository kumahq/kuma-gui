<template>
  <div class="component-frame">
    <ServiceSummary
      :service="props.service"
      :external-service="externalService"
    />
  </div>

  <DataPlaneList
    v-if="props.dataPlaneOverviews !== null"
    class="mt-4"
    :data-plane-overviews="props.dataPlaneOverviews"
    :dpp-filter-fields="props.dppFilterFields"
    :selected-dpp-name="props.selectedDppName"
    :is-gateway-view="props.dataPlaneOverviews[0]?.dataplane.networking.gateway !== undefined ?? false"
    @load-data="loadData"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import ServiceSummary from './ServiceSummary.vue'
import { FilterFields } from '@/app/common/KFilterBar.vue'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import { DataPlaneOverviewParameters } from '@/types/api.d'
import { DataPlaneOverview, ExternalService, ServiceInsight } from '@/types/index.d'

const props = defineProps({
  service: {
    type: Object as PropType<ServiceInsight>,
    required: true,
  },

  externalService: {
    type: Object as PropType<ExternalService | null>,
    required: false,
    default: null,
  },

  dataPlaneOverviews: {
    type: Array as PropType<DataPlaneOverview[] | null>,
    required: false,
    default: null,
  },

  dppFilterFields: {
    type: Object as PropType<FilterFields>,
    required: true,
  },

  selectedDppName: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits<{
  (event: 'load-dataplane-overviews', offset: number, params: DataPlaneOverviewParameters): void
}>()

function loadData(offset: number, params: DataPlaneOverviewParameters): void {
  const isGatewayService = props.service.serviceType?.startsWith('gateway') ?? false
  if (!isGatewayService) {
    // Never propagate a gateway filter when listing DPPs for services because we use the same table for them.
    delete params.gateway
  }

  emit('load-dataplane-overviews', offset, params)
}
</script>
