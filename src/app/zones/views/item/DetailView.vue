<template>
  <RouteView
    v-slot="{ t }"
    name="zone-cp-detail-view"
  >
    <AppView>
      <template
        v-if="props.notifications.length > 0"
        #notifications
      >
        <ul>
          <!-- eslint-disable vue/no-v-html  -->
          <li
            v-for="warning in props.notifications"
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
                  {{ t(`common.product.environment.${environment || 'unknown'}`) }}
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.authenticationType') }}
                </template>

                <template #body>
                  {{ authenticationType || t('common.not_applicable') }}
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <template
          v-for="subscriptions in [props.data.zoneInsight?.subscriptions ?? []]"
          :key="subscriptions"
        >
          <div
            v-if="subscriptions.length > 0"
          >
            <h2>{{ t('zone-cps.detail.subscriptions') }}</h2>

            <KCard class="mt-4">
              <template #body>
                <SubscriptionList
                  :subscriptions="subscriptions"
                />
              </template>
            </KCard>
          </div>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import {
  getZoneControlPlaneStatus,
  getZoneDpServerAuthType,
  getZoneControlPlaneEnvironment,
} from '../../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import type { ZoneOverview } from '@/types/index.d'

const props = withDefaults(defineProps<{
  data: ZoneOverview
  notifications: { kind: string, payload: Record<string, string> }[]
}>(), {
  notifications: () => [],
})

const environment = computed(() => getZoneControlPlaneEnvironment(props.data))
const status = computed(() => getZoneControlPlaneStatus(props.data))
const authenticationType = computed(() => getZoneDpServerAuthType(props.data))

</script>
