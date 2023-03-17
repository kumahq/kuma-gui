<template>
  <OverviewCharts class="mt-16" />
  <MeshResources class="mt-8" />
</template>

<script lang="ts" setup>
import MeshResources from '@/app/common/MeshResources.vue'
import { useOverviewCharts } from '@/components'

const OverviewCharts = useOverviewCharts()
</script>
