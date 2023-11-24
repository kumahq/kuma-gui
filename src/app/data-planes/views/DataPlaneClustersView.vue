<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-clusters-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            resource="Data Plane Proxy"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
            :query="route.params.codeSearch"
            @query-change="route.update({ codeSearch: $event })"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
</script>
