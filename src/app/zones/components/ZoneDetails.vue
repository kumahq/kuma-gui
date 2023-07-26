<template>
  <TabsWidget :tabs="filteredTabs">
    <template #tabHeader>
      <h1 class="entity-heading">
        Zone Control Plane:

        <TextWithCopyButton :text="processedZoneOverview.name">
          <router-link :to="detailViewRoute">
            {{ processedZoneOverview.name }}
          </router-link>
        </TextWithCopyButton>
      </h1>
    </template>

    <template #overview>
      <DefinitionList>
        <DefinitionListItem
          v-for="(value, property) in processedZoneOverview"
          :key="property"
          :term="t(`http.api.property.${property}`)"
        >
          <KBadge
            v-if="property === 'status'"
            :appearance="value === 'offline' ? 'danger' : 'success'"
          >
            {{ value }}
          </KBadge>

          <template v-else-if="property === 'name'">
            <TextWithCopyButton :text="value" />
          </template>

          <template v-else>
            {{ value }}
          </template>
        </DefinitionListItem>
      </DefinitionList>
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

    <template #config>
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
        data-testid="warning-no-subscriptions"
        appearance="warning"
      >
        <template #alertMessage>
          {{ t('zone-cps.routes.item.config.no-subscriptions') }}
        </template>
      </KAlert>
    </template>

    <template #warnings>
      <WarningsWidget :warnings="warnings" />
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KBadge, KAlert } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import type { ZoneCompatibility, ZoneOverview } from '@/types/index.d'
import { useI18n, useEnv } from '@/utilities'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/utilities/dataplane'
import { getZoneDpServerAuthType } from '@/utilities/helpers'

const { t } = useI18n()
const env = useEnv()

const TABS = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#insights',
    title: 'Zone Insights',
  },
  {
    hash: '#config',
    title: 'Config',
  },
  {
    hash: '#warnings',
    title: 'Warnings',
  },
]

const props = defineProps({
  zoneOverview: {
    type: Object as PropType<ZoneOverview>,
    required: true,
  },
})

const detailViewRoute = computed(() => ({
  name: 'zone-cp-detail-view',
  params: {
    zone: props.zoneOverview.name,
  },
}))

const processedZoneOverview = computed(() => {
  const { type, name } = props.zoneOverview
  const status = getItemStatusFromInsight(props.zoneOverview.zoneInsight)

  return {
    type,
    name,
    status,
    'Authentication Type': getZoneDpServerAuthType(props.zoneOverview),
  }
})

const subscriptionsReversed = computed(() => {
  const subscriptions = props.zoneOverview.zoneInsight?.subscriptions ?? []
  return Array.from(subscriptions).reverse()
})

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

const filteredTabs = computed(() => {
  if (warnings.value.length === 0) {
    return TABS.filter((tab) => tab.hash !== '#warnings')
  }

  return TABS
})
</script>
