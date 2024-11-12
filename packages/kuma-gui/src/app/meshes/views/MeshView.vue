<template>
  <RouteView
    name="mesh-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route, uri }"
  >
    <DataLoader
      :src="uri(
        sources,
        '/meshes/:name',
        {
          name: route.params.mesh,
        },
      )"
      v-slot="{ data: mesh }"
    >
      <AppView>
        <RouterView
          v-slot="{ Component }"
        >
          <component
            :is="Component"
            :mesh="mesh"
          />
        </RouterView>
      </AppView>
    </DataLoader>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
</script>
