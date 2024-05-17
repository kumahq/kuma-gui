<template>
  <RouteView
    v-slot="{ route, t, uri }"
    name="mesh-service-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <DataSource
      v-slot="{ data, error }"
      :src="uri(sources, '/meshes/:mesh/mesh-service/:name', {
        mesh: route.params.mesh,
        name: route.params.service,
      })"
    >
      <AppView
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
              name: 'mesh-service-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('services.routes.mesh-service-list-view.title'),
          },
        ]"
      >
        <template #title>
          <h1
            v-if="data"
          >
            <TextWithCopyButton :text="route.params.service">
              <RouteTitle
                :title="t('services.routes.item.title', { name: data.name })"
              />
            </TextWithCopyButton>
          </h1>
        </template>

        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <XTabs
            :selected="route.active?.name"
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

          <RouterView
            v-slot="child"
          >
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
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
