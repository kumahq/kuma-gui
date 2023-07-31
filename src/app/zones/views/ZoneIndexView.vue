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
        v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled' && store.getters['config/getMulticlusterStatus']"
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
import { useStore } from '@/store/store'
import { useEnv, useI18n } from '@/utilities'

const env = useEnv()
const { t } = useI18n()
const store = useStore()
</script>
