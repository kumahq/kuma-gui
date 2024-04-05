<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-detail-tabs-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <DataSource
      v-slot="{ data, error }: DataplaneOverviewSource"
      :src="`/meshes/${route.params.mesh}/dataplane-overviews/${route.params.dataPlane}`"
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
              name: 'data-plane-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('data-planes.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          v-if="data"
          #title
        >
          <h1>
            <TextWithCopyButton :text="data.name">
              <RouteTitle
                :title="t('data-planes.routes.item.title', { name: data.name })"
              />
            </TextWithCopyButton>
          </h1>
        </template>
        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <NavTabs
            :active-route-name="route.active?.name"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}`]
            >
              <RouterLink
                :to="{ name }"
                :data-testid="`${name}-tab`"
              >
                {{ t(`data-planes.routes.item.navigation.${name}`) }}
              </RouterLink>
            </template>
          </NavTabs>

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
import { DataplaneOverviewSource } from '../sources'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
