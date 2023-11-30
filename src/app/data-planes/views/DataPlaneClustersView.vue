<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-clusters-view"
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
            :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
          />
        </h2>
      </template>

      <KCard>
        <EnvoyData
          resource="Data Plane Proxy"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
          :query="route.params.codeSearch"
          :is-filter-mode="route.params.codeFilter === 'true'"
          :is-reg-exp-mode="route.params.codeRegExp === 'true'"
          @query-change="route.update({ codeSearch: $event })"
          @filter-mode-change="route.update({ codeFilter: $event })"
          @reg-exp-mode-change="route.update({ codeRegExp: $event })"
        />
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
</script>
