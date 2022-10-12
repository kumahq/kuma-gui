<template>
  <div class="service-details">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <ServiceInsightDetails
      v-else-if="serviceInsight !== null"
      :service-insight="serviceInsight"
    />

    <ExternalServiceDetails
      v-else-if="externalService !== null"
      :external-service="externalService"
    />

    <EmptyBlock v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue'

import { ExternalService, ServiceInsight } from '@/types'
import Kuma from '@/services/kuma'
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import EmptyBlock from '@/components/EmptyBlock.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'

const props = defineProps({
  serviceType: {
    type: String as PropType<'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'>,
    required: false,
    default: 'internal',
  },

  name: {
    type: String,
    required: true,
  },

  mesh: {
    type: String,
    required: true,
  },
})

const serviceInsight = ref<ServiceInsight | null>(null)
const externalService = ref<ExternalService | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => props.mesh, function () {
  loadEntity()
})

watch(() => props.name, function () {
  loadEntity()
})

loadEntity()

async function loadEntity() {
  isLoading.value = true
  error.value = null
  serviceInsight.value = null
  externalService.value = null

  const mesh = props.mesh
  const name = props.name

  try {
    if (props.serviceType === 'external') {
      externalService.value = await Kuma.getExternalService({ mesh, name })
    } else {
      serviceInsight.value = await Kuma.getServiceInsight({ mesh, name })
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

<style lang="scss" scoped>
.service-details {
  padding: var(--spacing-md);
}
</style>
