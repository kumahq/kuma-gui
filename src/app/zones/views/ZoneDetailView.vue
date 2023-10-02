<template>
  <RouteView
    v-slot="{ t }"
    name="zone-cp-detail-view"
  >
    <AppView>
      <template
        v-if="warnings.length > 0"
        #notifications
      >
        <ul>
          <!-- eslint-disable vue/no-v-html  -->
          <li
            v-for="warning in warnings"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"

            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
          <!-- eslint-enable -->
        </ul>
      </template>

      <div
        data-testid="detail-view-details"
        class="stack"
      >
        <KCard>
          <template #body>
            <div
              class="columns"
              style="--columns: 3;"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge :status="status" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.type') }}
                </template>

                <template #body>
                  {{ type }}
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.authenticationType') }}
                </template>

                <template #body>
                  {{ authenticationType }}
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <div v-if="(props.data.zoneInsight?.subscriptions ?? []).length > 0">
          <h2>{{ t('zone-cps.detail.subscriptions') }}</h2>

          <KCard class="mt-4">
            <template #body>
              <SubscriptionList :subscriptions="props.data.zoneInsight?.subscriptions ?? []" />
            </template>
          </KCard>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { getZoneControlPlaneStatus, getZoneDpServerAuthType } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import type { Config } from '@/types/config.d'
import type { ZoneOverview } from '@/types/index.d'

const props = defineProps<{
  data: ZoneOverview
  config: Config | undefined
}>()

const type = computed(() => {
  for (const subscription of props.data.zoneInsight?.subscriptions ?? []) {
    if (subscription.config) {
      return JSON.parse(subscription.config).environment
    }
  }
  return 'kubernetes'
})
const status = computed(() => getZoneControlPlaneStatus(props.data))
const authenticationType = computed(() => getZoneDpServerAuthType(props.data))

const warnings = computed(() => {
  const warnings = []
  const subscriptions = props.data.zoneInsight?.subscriptions ?? []

  if (props.config?.store.type === 'memory') {
    warnings.push({
      kind: 'STORE_TYPE_MEMORY',
      payload: {},
    })
  }
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    const kumaCpVersion = lastSubscription.version.kumaCp.version || '-'
    const { kumaCpGlobalCompatible = true } = lastSubscription.version.kumaCp

    if (!kumaCpGlobalCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
        payload: {
          zoneCpVersion: kumaCpVersion,
        },
      })
    }
  }

  return warnings
})

</script>
