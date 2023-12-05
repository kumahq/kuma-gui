<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-clusters-view"
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
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-clusters-view')"
          />
        </h2>
      </template>

      <KCard>
        <EnvoyData
          resource="Zone"
          :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/clusters`"
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
