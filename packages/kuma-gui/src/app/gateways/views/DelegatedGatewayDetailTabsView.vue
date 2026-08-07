<template>
  <RouteView
    name="delegated-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/meshes/:mesh/service-insights/:name', {
        mesh: route.params.mesh,
        name: route.params.service,
      })"
      v-slot="{ data: sourceData }"
    >
      <AppView
        :docs="t('delegated-gateways.href.docs')"
        :breadcrumbs="[
          {
            to: {
              name: 'mesh-detail-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: route.params.mesh,
          },
          {
            to: {
              name: 'delegated-gateway-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('delegated-gateways.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template #title>
          <DataLoader
            :data="[sourceData]"
            variant="header"
            v-slot="{ data: [data] }"
          >
            <XLayout
              variant="y-stack"
              size="small"
            >
              <h1>
                <RouteTitle
                  :title="t('delegated-gateways.routes.item.title', { name: data.name })"
                />
              </h1>
            </XLayout>
          </DataLoader>
        </template>

        <XTabs
          :selected="route.child()?.name"
        >
          <template
            v-for="{ name } in route.children"
            :key="name"
            #[`${name}-tab`]
          >
            <XAction
              :to="{ name }"
            >
              {{ t(`delegated-gateways.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView />
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script setup lang="ts">
import { sources } from '@/app/gateways/sources'
</script>
