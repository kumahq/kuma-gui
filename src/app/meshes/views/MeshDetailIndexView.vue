<template>
  <RouteView
    name="mesh-detail-view"
  >
    <AppView
      :breadcrumbs="[
        ...(route.name !== 'mesh-detail-view' ? [{
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh as string,
        }] : []),
      ]"
    >
      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
