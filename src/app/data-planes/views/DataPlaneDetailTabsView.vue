<template>
  <RouteView
    name="data-plane-detail-tabs-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
    v-slot="{ route, t }"
  >
    <DataSource
      :src="`/meshes/${route.params.mesh}/dataplane-overviews/${route.params.dataPlane}`"
      v-slot="{ data, error }: DataplaneOverviewSource"
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
                {{ t(`data-planes.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
              :mesh="props.mesh"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneOverviewSource } from '../sources'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  mesh: Mesh
}>()
</script>
