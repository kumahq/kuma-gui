<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-config-view"
    :params="{
      zoneEgress: ''
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-egresses.routes.item.navigation.zone-egress-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard class="mt-4">
        <template #body>
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
              />
            </template>
          </DataSource>
        </template>
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
