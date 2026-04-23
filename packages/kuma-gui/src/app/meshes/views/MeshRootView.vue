<template>
  <RouteView
    name="mesh-index-view"
    v-slot="{ t }"
  >
    <AppView
      :breadcrumbs="['mesh-list-view'].includes(String(router.currentRoute.value.name ?? '')) ? undefined : [
        {
          to: {
            name: 'mesh-list-view',
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
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
