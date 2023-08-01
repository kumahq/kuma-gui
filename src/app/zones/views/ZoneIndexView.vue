<template>
  <RouteView>
    <AppView>
      <template #title>
        <h1>{{ t('zones.routes.items.title') }}</h1>
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
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useEnv, useI18n } from '@/utilities'

const env = useEnv()
const { t } = useI18n()
const store = useStore()
</script>
