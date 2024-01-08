<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-config-view"
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
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-config-view')"
          />
        </h2>
      </template>

      <KCard>
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
              v-slot="{ copy, copying }"
              :resource="data.config"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter"
              :is-reg-exp-mode="route.params.codeRegExp"
              @query-change="route.update({ codeSearch: $event })"
              @filter-mode-change="route.update({ codeFilter: $event })"
              @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            >
              <DataSource
                v-if="copying"
                :src="`/zone-ingresses/${route.params.zoneIngress}/as/kubernetes?no-store`"
                @change="(data) => {
                  copy((resolve) => resolve(data))
                }"
                @error="(e) => {
                  copy((_resolve, reject) => reject(e))
                }"
              />
            </ResourceCodeBlock>
          </template>
        </DataSource>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ZoneIngressSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
</script>
