<template>
  <TabsWidget :tabs="TABS">
    <template #overview>
      <div class="stack">
        <KCard>
          <template #body>
            <div
              class="columns"
              style="--columns: 2;"
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
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <template v-if="props.zoneEgressOverview.zoneEgress.networking?.address && props.zoneEgressOverview.zoneEgress.networking?.port">
                    <TextWithCopyButton :text="`${props.zoneEgressOverview.zoneEgress.networking.address}:${props.zoneEgressOverview.zoneEgress.networking.port}`" />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <KCard>
          <template #body>
            <AccordionList :initially-open="0">
              <AccordionItem
                v-for="(subscription, index) in subscriptionsReversed"
                :key="index"
              >
                <template #accordion-header>
                  <SubscriptionHeader :subscription="subscription" />
                </template>

                <template #accordion-content>
                  <SubscriptionDetails
                    :subscription="subscription"
                    is-discovery-subscription
                  />
                </template>
              </AccordionItem>
            </AccordionList>
          </template>
        </KCard>
      </div>
    </template>

    <template #xds-configuration>
      <h2 class="mb-4">
        {{ t('zone-egresses.routes.item.tabs.xds_configuration') }}
      </h2>

      <KCard>
        <template #body>
          <EnvoyData
            :status="status"
            resource="Zone"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/xds`"
            query-key="envoy-data-xds-zone-egress"
          />
        </template>
      </KCard>
    </template>

    <template #envoy-stats>
      <h2 class="mb-4">
        {{ t('zone-egresses.routes.item.tabs.stats') }}
      </h2>

      <KCard>
        <template #body>
          <EnvoyData
            :status="status"
            resource="Zone"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/stats`"
            query-key="envoy-data-stats-zone-egress"
          />
        </template>
      </KCard>
    </template>

    <template #envoy-clusters>
      <h2 class="mb-4">
        {{ t('zone-egresses.routes.item.tabs.clusters') }}
      </h2>

      <KCard>
        <template #body>
          <EnvoyData
            :status="status"
            resource="Zone"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/clusters`"
            query-key="envoy-data-clusters-zone-egress"
          />
        </template>
      </KCard>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const TABS = [
  {
    hash: '#overview',
    title: t('zone-egresses.routes.item.tabs.overview'),
  },
  {
    hash: '#xds-configuration',
    title: t('zone-egresses.routes.item.tabs.xds_configuration'),
  },
  {
    hash: '#envoy-stats',
    title: t('zone-egresses.routes.item.tabs.stats'),
  },
  {
    hash: '#envoy-clusters',
    title: t('zone-egresses.routes.item.tabs.clusters'),
  },
]

const props = defineProps({
  zoneEgressOverview: {
    type: Object as PropType<ZoneEgressOverview>,
    required: true,
  },
})

const status = computed(() => getItemStatusFromInsight(props.zoneEgressOverview.zoneEgressInsight))

const subscriptionsReversed = computed<any[]>(() => {
  const subscriptions = props.zoneEgressOverview.zoneEgressInsight?.subscriptions ?? []
  return Array.from(subscriptions).reverse()
})
</script>
