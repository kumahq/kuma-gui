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
      v-slot="{ data, error }"
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
          <h1
            v-if="data"
          >
            <TextWithCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('builtin-gateways.routes.item.title', { name: data.name })"
              />
            </TextWithCopyButton>
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
                {{ t(`builtin-gateways.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView
            v-slot="{ Component }"
          >
            <component
              :is="Component"
              :gateway="data"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
