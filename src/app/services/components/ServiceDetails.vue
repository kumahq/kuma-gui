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
    @load-data="loadData"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import { DataPlaneOverview, ExternalService, ServiceInsight } from '@/types/index.d'
import DataPlaneList from '@/app/data-planes/components/DataPlaneList.vue'
import ServiceSummary from './ServiceSummary.vue'

const emit = defineEmits(['load-data'])

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
})

function loadData(offset: number): void {
  emit('load-data', offset)
}
</script>
