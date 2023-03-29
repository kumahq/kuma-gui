<template>
  <div class="kcard-stack">
    <OverviewCharts />

    <MeshResources />
  </div>
</template>

<script lang="ts" setup>
import MeshResources from '@/app/common/MeshResources.vue'
import { useOverviewCharts } from '@/components'

const OverviewCharts = useOverviewCharts()
</script>
