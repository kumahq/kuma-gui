<template>
  <XAction
    v-if="dataplaneType === 'standard'"
    :to="{
      name: 'service-detail-view',
      params: {
        service,
      },
    }"
  >
    {{ service }}
  </XAction>

  <template v-else>
    {{ service }}
  </template>
</template>

<script lang="ts" setup>
defineProps<{
  service: string
  dataplaneType: string
}>()
</script>
