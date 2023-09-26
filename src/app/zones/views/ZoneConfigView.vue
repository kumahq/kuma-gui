<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-cp-config-view"
    :params="{
      zone: ''
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-cps.routes.item.navigation.zone-cp-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard class="mt-4">
        <template #body>
          <DataSource
            v-slot="{ data, error }: ZoneOverviewSource"
            :src="`/zone-cps/${route.params.zone}`"
          >
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <template v-else>
              <template
                v-for="(config, index) in [getConfig(data)]"
                :key="index"
              >
                <CodeBlock
                  v-if="config !== null"
                  id="code-block-zone-config"
                  language="json"
                  :code="config"
                  is-searchable
                  query-key="zone-config"
                />

                <KAlert
                  v-else
                  class="mt-4"
                  data-testid="warning-no-subscriptions"
                  appearance="warning"
                >
                  <template #alertMessage>
                    {{ t('zone-cps.detail.no_subscriptions') }}
                  </template>
                </KAlert>
              </template>
            </template>
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ZoneOverviewSource } from '../sources'
import CodeBlock from '@/app/common/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { ZoneOverview } from '@/types'

function getConfig(zoneOverview: ZoneOverview) {
  const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]

    if (lastSubscription.config) {
      return JSON.stringify(JSON.parse(lastSubscription.config), null, 2)
    }
  }

  return null
}
</script>
