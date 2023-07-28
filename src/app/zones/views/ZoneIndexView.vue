<template>
  <RouteView>
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-index-view',
          },
          text: t('zones.routes.items.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zones.routes.items.title')"
            :render="true"
          />
        </h1>
      </template>

      <template
        v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
        #actions
      >
        <KButton
          appearance="creation"
          icon="plus"
          :to="{ name: 'zone-create-view' }"
        >
          {{ t('zones.index.create') }}
        </KButton>
      </template>

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
import { KButton } from '@kong/kongponents'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import { useStore } from '@/store/store'
import { useEnv, useI18n } from '@/utilities'

const env = useEnv()
const { t } = useI18n()
const store = useStore()

const tabs: NavTab[] = [
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
]
</script>
