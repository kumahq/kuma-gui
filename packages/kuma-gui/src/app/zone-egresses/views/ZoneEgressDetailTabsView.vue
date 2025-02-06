<template>
  <RouteView
    name="zone-egress-detail-tabs-view"
    :params="{
      zone: '',
      proxy: '',
    }"
    v-slot="{ route, can, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/zone-egress-overviews/:name', {
        name: route.params.proxy,
      })"
      v-slot="{ data, error }"
    >
      <AppView
        :docs="t('zone-ingresses.href.docs')"
        :breadcrumbs="[
          ...(can('use zones') ? [
            {
              to: {
                name: 'zone-cp-list-view',
              },
              text: t('zone-cps.routes.item.breadcrumbs'),
            },
            {
              to: {
                name: 'zone-cp-detail-view',
                params: {
                  zone: route.params.zone,
                },
              },
              text: route.params.zone,
            },
          ] : []),
          {
            to: {
              name: 'zone-egress-list-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: t('zone-egresses.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <h1
            v-if="data"
          >
            <XCopyButton :text="data.name">
              <RouteTitle
                :title="t('zone-egresses.routes.item.title', { name: data.name })"
              />
            </XCopyButton>
          </h1>
        </template>

        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
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
                {{ t(`zone-egresses.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
</script>
