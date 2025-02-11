<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      proxy: '',
      proxyType: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <RouteTitle
        :render="false"
        :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
      />
      <XCard>
        <DataLoader
          :src="uri(sources, `/connections/clusters/for/:proxyType/:name/:mesh`, {
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
            name: route.params.proxy,
            mesh: route.params.mesh || '*',
          })"
          v-slot="{ data, refresh }"
        >
          <XCodeBlock
            language="json"
            :code="data"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </XCodeBlock>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
const props = defineProps<{
  routeName: string
}>()
</script>
