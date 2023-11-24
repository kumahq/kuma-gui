<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-stats-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-stats-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            resource="Zone"
            :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/stats`"
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
