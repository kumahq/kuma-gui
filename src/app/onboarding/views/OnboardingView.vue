<template>
  <RouteView>
    <AppView>
      <router-view
        v-slot="{ Component }"
      >
        <component :is="Component" />
      </router-view>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
</script>
