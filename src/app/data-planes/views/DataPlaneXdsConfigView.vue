<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-xds-config-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-xds-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            resource="Data Plane Proxy"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/xds`"
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter === 'true'"
            :is-reg-exp-mode="route.params.codeRegExp === 'true'"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
</script>
