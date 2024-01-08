<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-stats-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
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
        <EnvoyData
          resource="Zone"
          :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/stats`"
          :query="route.params.codeSearch"
          :is-filter-mode="route.params.codeFilter"
          :is-reg-exp-mode="route.params.codeRegExp"
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
