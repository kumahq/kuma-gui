<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="gateway-list-tabs-view"
      :params="{
        mesh: '',
      }"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle :title="t(`${currentRoute.name === 'builtin-gateway-list-view' ? 'builtin' : 'delegated'}-gateways.routes.items.title`)" />
          </h2>
        </template>

        <template #actions>
          <LinkBox>
            <RouterLink
              :class="{
                'active': currentRoute.name === 'builtin-gateway-list-view',
              }"
              :to="{
                name: 'builtin-gateway-list-view',
                params: {
                  mesh: route.params.mesh,
                },
              }"
            >
              {{ t('gateways.routes.items.navigation.builtin') }}
            </RouterLink>

            <RouterLink
              :class="{
                'active': currentRoute.name === 'delegated-gateway-list-view',
              }"
              :to="{
                name: 'delegated-gateway-list-view',
                params: {
                  mesh: route.params.mesh,
                },
              }"
            >
              {{ t('gateways.routes.items.navigation.delegated') }}
            </RouterLink>
          </LinkBox>
        </template>

        <RouterView />
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import LinkBox from '@/app/common/LinkBox.vue'
import type { MeSource } from '@/app/me/sources'

const currentRoute = useRoute()
</script>
