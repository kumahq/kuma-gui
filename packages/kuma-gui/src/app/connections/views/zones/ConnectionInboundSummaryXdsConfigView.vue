<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      proxy: '',
      proxyType: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('connections.routes.item.navigation.xds')"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/connections/xds/for/:proxyType/:name/inbound/:inbound', {
          name: route.params.proxy,
          inbound: `${props.networking.port}`,
          proxyType: route.params.proxyType === 'ingresses' ? 'zone-ingress' : 'zone-egress',
        })"
        v-slot="{ data: raw, refresh }"
      >
        <XCodeBlock
          language="json"
          :code="JSON.stringify(raw, null, 2)"
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
              {{ t('common.refresh') }}
            </XAction>
          </template>
        </XCodeBlock>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '@/app/connections/sources'
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'

const props = defineProps<{
  routeName: string
  networking: ZoneIngress['networking'] | ZoneEgress['networking']
}>()
</script>
