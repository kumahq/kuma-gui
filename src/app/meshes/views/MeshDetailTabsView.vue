<template>
  <RouteView
    name="mesh-detail-tabs-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <template #title>
        <h1>
          <XCopyButton
            :text="route.params.mesh"
          >
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
            />
          </XCopyButton>
        </h1>
      </template>

      <DataLoader
        :src="`/meshes/${route.params.mesh}`"
        v-slot="{ data: mesh }: MeshSource"
      >
        <XTabs
          :selected="route.child()?.name"
          data-testid="mesh-tabs"
        >
          <template
            v-for="{ name } in route.children.filter(({ name }) => name !== 'external-service-list-view')"
            :key="name"
            #[`${name}-tab`]
          >
            <XAction
              :to="{ name }"
            >
              {{ t(`meshes.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView
          v-slot="{ Component }"
        >
          <component
            :is="Component"
            :mesh="mesh"
          />
        </RouterView>
      </DataLoader>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshSource } from '../sources'
</script>
