<template>
  <RouteView>
    <AppView>
      <div class="kcard-stack">
        <OverviewCharts />

        <MeshResources />
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import MeshResources from '@/app/common/MeshResources.vue'
import { useOverviewCharts } from '@/components'

const OverviewCharts = useOverviewCharts()
</script>
