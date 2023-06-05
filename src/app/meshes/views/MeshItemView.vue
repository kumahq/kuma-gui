<template>
  <RouteView
    v-slot="{route}"
  >
    <RouteTitle
      :title="t('meshes.routes.item.title', {name: route.params.mesh})"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: t('meshes.routes.item.breadcrumbs')
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
import { useI18n } from '@/utilities'
const { t } = useI18n()

</script>
