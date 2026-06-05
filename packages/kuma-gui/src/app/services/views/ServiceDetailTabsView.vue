<template>
  <RouteView
    name="service-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, `/meshes/:mesh/service-insights/:name`, {
        mesh: route.params.mesh,
        name: route.params.service,
      })"
      v-slot="{ data }"
    >
      <AppView
        :docs="t('services.href.docs')"
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
              name: 'service-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('services.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template #title>
          <DataLoader
            :data="[data]"
            variant="header"
            v-slot="{ data: [item] }"
          >
            <XLayout
              variant="y-stack"
              size="small"
            >
              <h1>
                <RouteTitle
                  :title="t('services.routes.item.title', { name: item.name })"
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
              {{ t(`services.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView />
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script setup lang="ts">
import { sources } from '../sources'
</script>
