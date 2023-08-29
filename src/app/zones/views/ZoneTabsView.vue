<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import NavTabs from '@/app/common/NavTabs.vue'
</script>
<template>
  <RouteView
    v-slot="{ t, can }"
  >
    <AppView>
      <NavTabs
        v-if="can('use zones')"
        :tabs="[
          {
            title: t('zones.routes.items.navigation.zone-cp-list-view'),
            routeName: 'zone-cp-list-view',
            module: 'zone-cps',
          },
          {
            title: t('zones.routes.items.navigation.zone-ingress-list-view'),
            routeName: 'zone-ingress-list-view',
            module: 'zone-ingresses',
          },
          {
            title: t('zones.routes.items.navigation.zone-egress-list-view'),
            routeName: 'zone-egress-list-view',
            module: 'zone-egresses',
          },
        ]"
      />
      <RouterView />
    </AppView>
  </RouteView>
</template>
