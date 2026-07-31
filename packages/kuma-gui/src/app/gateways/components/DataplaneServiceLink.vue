<template>
  <XAction
    v-if="dataplaneType === 'delegated'"
    :to="{
      name: 'delegated-gateway-detail-view',
      params: {
        service,
      },
    }"
  >
    {{ service }}
  </XAction>

  <DataplaneServiceLink
    v-else
    :service="service"
    :dataplane-type="dataplaneType"
  />
</template>

<script lang="ts" setup>
import DataplaneServiceLink from '@/app/data-planes/components/DataplaneServiceLink.vue'

defineProps<{
  service: string
  dataplaneType: string
}>()
</script>
