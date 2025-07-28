<template>
  <RouteView
    name="data-plane-root-view"
    :params="{
      mesh: '',
      proxy: '',
    }"
    v-slot="{ route, uri }"
  >
    <DataLoader
      :src="uri(sources, '/meshes/:mesh/dataplane-overviews/:name', {
        mesh: route.params.mesh,
        name: route.params.proxy,
      })"
      v-slot="{ data }"
    >
      <DataPlaneRouteGuard
        :data="data"
      >
        <RouterView v-slot="{ Component }">
          <component
            :is="Component"
            :mesh="props.mesh"
          />
        </RouterView>
      </DataPlaneRouteGuard>
    </DataLoader>
  </RouteView>
</template>

<script setup lang="ts">
import { sources } from '../sources'
import DataPlaneRouteGuard from './DataPlaneRouteGuard.vue'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  mesh: Mesh
}>()
</script>
