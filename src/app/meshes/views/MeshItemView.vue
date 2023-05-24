<template>
  <RouteView
    v-slot="{route}"
  >
    <RouteTitle
      :title="`${route.params.mesh}`"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: 'Meshes'
        },
        {
          to: {
            name: 'mesh-detail-view',
            params: route.params
          },
          text: route.params.mesh
        }
      ]"
    >
      <RouterView
        v-slot="child"
      >
        <component
          :is="child.Component"
          :key="child.route.path"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'

</script>
