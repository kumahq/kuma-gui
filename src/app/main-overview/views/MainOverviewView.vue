<template>
  <OverviewCharts class="mt-16" />
  <MeshResources class="mt-8" />
</template>

<script lang="ts" setup>
import { useOverviewCharts } from '@/components'
import MeshResources from '@/app/common/MeshResources.vue'

const OverviewCharts = useOverviewCharts()
</script>
