<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-config-view"
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
            :title="t('zone-egresses.routes.item.navigation.zone-egress-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <DataSource
          v-slot="{ data, error }: ZoneEgressSource"
          :src="`/zone-egresses/${route.params.zoneEgress}`"
        >
          <ErrorBlock
            v-if="error !== undefined"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <template v-else>
            <ResourceCodeBlock
              id="code-block-zone-egress"
              :resource="data"
              :resource-fetcher="(params) => kumaApi.getZoneEgress({ name: route.params.zoneEgress }, params)"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter === 'true'"
              :is-reg-exp-mode="route.params.codeRegExp === 'true'"
              @query-change="route.update({ codeSearch: $event })"
              @filter-mode-change="route.update({ codeFilter: $event })"
              @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            />
          </template>
        </DataSource>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ZoneEgressSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
