<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-config-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error }: ZoneIngressSource"
            :src="`/zone-ingresses/${route.params.zoneIngress}`"
          >
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <template v-else>
              <ResourceCodeBlock
                id="code-block-zone-ingress"
                :resource="data"
                :resource-fetcher="(params) => kumaApi.getZoneIngress({ name: route.params.zoneIngress }, params)"
                is-searchable
                :query="route.params.codeSearch"
                @query-change="route.update({ codeSearch: $event })"
              />
            </template>
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ZoneIngressSource } from '../../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
