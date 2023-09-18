<template>
  <RouteView
    name="mesh-index-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: t('meshes.routes.item.breadcrumbs'),
        },
      ]"
    >
      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
