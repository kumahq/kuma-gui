<template>
  <RouteView>
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

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'

const route = useRoute()
</script>
