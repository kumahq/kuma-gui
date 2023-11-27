<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-clusters-view"
    :params="{
      zoneEgress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-egresses.routes.item.navigation.zone-egress-clusters-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            resource="Zone"
            :src="`/zone-egresses/${route.params.zoneEgress}/data-path/clusters`"
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
