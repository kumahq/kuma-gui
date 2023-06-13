<template>
  <RouteView>
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-index-view',
          },
          text: i18n.t('zones.routes.items.breadcrumbs')
        },
      ]"
    >
      <NavTabs
        v-if="store.getters['config/getMulticlusterStatus']"
        :tabs="tabs"
      />

      <RouterView v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.path"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const i18n = useI18n()
const store = useStore()

const tabs: NavTab[] = [
  {
    title: i18n.t('zones.routes.items.navigation.zone-cp-list-view'),
    routeName: 'zone-cp-list-view',
    module: 'zone-cps',
  },
  {
    title: i18n.t('zones.routes.items.navigation.zone-ingress-list-view'),
    routeName: 'zone-ingress-list-view',
    module: 'zone-ingresses',
  },
  {
    title: i18n.t('zones.routes.items.navigation.zone-egress-list-view'),
    routeName: 'zone-egress-list-view',
    module: 'zone-egresses',
  },
]
</script>
