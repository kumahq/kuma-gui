<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-detail-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.mesh">
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataLoader
        v-slot="{ data: mesh }: MeshSource"
        :src="`/meshes/${route.params.mesh}`"
      >
        <XTabs
          :selected="route.active?.name"
          data-testid="mesh-tabs"
        >
          <template
            v-for="{ name } in route.children.filter(({ name }) => name !== 'external-service-list-view')"
            :key="name"
            #[`${name}-tab`]
          >
            <XAction
              :to="{ name }"
              :data-testid="`${name}-tab`"
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
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
