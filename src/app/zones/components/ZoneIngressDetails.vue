<template>
  <TabsWidget :tabs="TABS">
    <template #overview>
      <DefinitionList>
        <DefinitionListItem
          v-for="(value, property) in processedZoneIngressOverview"
          :key="property"
          :term="t(`http.api.property.${property}`)"
        >
          <template v-if="property === 'name'">
            <TextWithCopyButton :text="props.zoneIngressOverview.name">
              <RouterLink
                :to="{
                  name: 'zone-ingress-detail-view',
                  params: {
                    zoneIngress: props.zoneIngressOverview.name,
                  },
                }"
              >
                {{ props.zoneIngressOverview.name }}
              </RouterLink>
            </TextWithCopyButton>
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
            <SubscriptionDetails
              :details="value"
              is-discovery-subscription
            />
          </template>
        </AccordionItem>
      </AccordionList>
    </template>

    <template #xds-configuration>
      <EnvoyData
        data-path="xds"
        :zone-ingress-name="processedZoneIngressOverview.name"
        query-key="envoy-data-zone-ingress"
      />
    </template>

    <template #envoy-stats>
      <EnvoyData
        data-path="stats"
        :zone-ingress-name="processedZoneIngressOverview.name"
        query-key="envoy-data-zone-ingress"
      />
    </template>

    <template #envoy-clusters>
      <EnvoyData
        data-path="clusters"
        :zone-ingress-name="processedZoneIngressOverview.name"
        query-key="envoy-data-zone-ingress"
      />
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneIngressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const TABS = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#insights',
    title: 'Zone Ingress Insights',
  },
  {
    hash: '#xds-configuration',
    title: 'XDS Configuration',
  },
  {
    hash: '#envoy-stats',
    title: 'Stats',
  },
  {
    hash: '#envoy-clusters',
    title: 'Clusters',
  },
]

const props = defineProps({
  zoneIngressOverview: {
    type: Object as PropType<ZoneIngressOverview>,
    required: true,
  },
})

const processedZoneIngressOverview = computed(() => {
  const { type, name } = props.zoneIngressOverview

  return {
    type,
    name,
  }
})

const subscriptionsReversed = computed<any[]>(() => {
  const subscriptions = props.zoneIngressOverview.zoneIngressInsight?.subscriptions ?? []
  return Array.from(subscriptions).reverse()
})
</script>
