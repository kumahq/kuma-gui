<template>
  <div class="stack">
    <WarningsWidget
      v-if="warnings.length > 0"
      :warnings="warnings"
    />

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

    <div>
      <h2>{{ t('zone-cps.detail.configuration_title') }}</h2>

      <KCard class="mt-4">
        <template #body>
          <CodeBlock
            v-if="codeOutput !== null"
            id="code-block-zone-config"
            language="json"
            :code="codeOutput"
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
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KAlert, KCard } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import { getZoneControlPlaneStatus } from '../getZoneControlPlaneStatus'
import CodeBlock from '@/app/common/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import type { ZoneCompatibility, ZoneOverview } from '@/types/index.d'
import { useI18n, useEnv } from '@/utilities'
import { INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/utilities/dataplane'
import { getZoneDpServerAuthType } from '@/utilities/helpers'

const { t } = useI18n()
const env = useEnv()

const props = defineProps({
  zoneOverview: {
    type: Object as PropType<ZoneOverview>,
    required: true,
  },
})

const type = computed(() => {
  for (const subscription of props.zoneOverview.zoneInsight?.subscriptions ?? []) {
    if (subscription.config) {
      return JSON.parse(subscription.config).environment
    }
  }

  return 'kubernetes'
})
const status = computed(() => getZoneControlPlaneStatus(props.zoneOverview))
const authenticationType = computed(() => getZoneDpServerAuthType(props.zoneOverview))

const warnings = computed<ZoneCompatibility[]>(() => {
  const warnings = []
  const subscriptions = props.zoneOverview.zoneInsight?.subscriptions ?? []

  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    const kumaCpVersion = lastSubscription.version.kumaCp.version || '-'
    const { kumaCpGlobalCompatible = true } = lastSubscription.version.kumaCp

    if (!kumaCpGlobalCompatible) {
      warnings.push({
        kind: INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS,
        payload: {
          zoneCpVersion: kumaCpVersion,
          globalCpVersion: env('KUMA_VERSION'),
        },
      })
    }
  }

  return warnings
})

const codeOutput = computed(() => {
  const subscriptions = props.zoneOverview.zoneInsight?.subscriptions ?? []
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]

    if (lastSubscription.config) {
      return JSON.stringify(JSON.parse(lastSubscription.config), null, 2)
    }
  }

  return null
})
</script>
