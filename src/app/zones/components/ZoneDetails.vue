<template>
  <TabsWidget :tabs="TABS">
    <template #overview>
      <div class="stack">
        <WarningsWidget
          v-if="warnings.length > 0"
          :warnings="warnings"
        />

        <KCard>
          <template #body>
            <div class="variable-columns">
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
                  {{ t('http.api.property.name') }}
                </template>

                <template #body>
                  <TextWithCopyButton :text="props.zoneOverview.name">
                    <RouterLink
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: props.zoneOverview.name,
                        },
                      }"
                    >
                      {{ props.zoneOverview.name }}
                    </RouterLink>
                  </TextWithCopyButton>
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

          <CodeBlock
            v-if="codeOutput !== null"
            id="code-block-zone-config"
            class="mt-4"
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
        </div>
      </div>
    </template>

    <template #insights>
      <AccordionList :initially-open="0">
        <AccordionItem
          v-for="(value, key) in subscriptionsReversed"
          :key="key"
        >
          <template #accordion-header>
            <SubscriptionHeader :details="value" />
          </template>

          <template #accordion-content>
            <SubscriptionDetails :details="value" />
          </template>
        </AccordionItem>
      </AccordionList>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KAlert, KCard } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import { getZoneControlPlaneStatus } from '../getZoneControlPlaneStatus'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import type { ZoneCompatibility, ZoneOverview } from '@/types/index.d'
import { useI18n, useEnv } from '@/utilities'
import { INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/utilities/dataplane'
import { getZoneDpServerAuthType } from '@/utilities/helpers'

const { t } = useI18n()
const env = useEnv()

const TABS = [
  {
    hash: '#overview',
    title: t('zone-cps.routes.item.tabs.overview'),
  },
  {
    hash: '#insights',
    title: t('zone-cps.routes.item.tabs.insights'),
  },
]

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

const subscriptionsReversed = computed(() => {
  const subscriptions = props.zoneOverview.zoneInsight?.subscriptions ?? []
  return Array.from(subscriptions).reverse()
})
</script>

<style lang="scss" scoped>
.definition-card-list>*+* {
  margin-top: var(--spacing-xs);
}
</style>
