<template>
  <RouteView
    name="builtin-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      gateway: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/meshes/:mesh/mesh-gateways/:name', {
        mesh: route.params.mesh,
        name: route.params.gateway,
      })"
      v-slot="{ data: sourceData, result }"
    >
      <AppView
        :docs="t('builtin-gateways.href.docs')"
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
              name: 'builtin-gateway-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('builtin-gateways.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <DataLoader
            :data="[sourceData]"
            variant="header"
            v-slot="{ data: [data] }"
          >
            <h1>
              <XCopyButton
                :text="data.name"
              >
                <RouteTitle
                  :title="t('builtin-gateways.routes.item.title', { name: data.name })"
                />
              </XCopyButton>
            </h1>
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
              {{ t(`builtin-gateways.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView
          v-slot="{ Component }"
        >
          <component
            :is="Component"
            :gateway="result"
          />
        </RouterView>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
</script>
