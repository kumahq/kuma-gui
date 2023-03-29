<template>
  <OverviewCharts />

  <MeshResources class="mt-4" />
</template>

<script lang="ts" setup>
import MeshResources from '@/app/common/MeshResources.vue'
import { useOverviewCharts } from '@/components'

const OverviewCharts = useOverviewCharts()
</script>
