<template>
  <TabsWidget :tabs="TABS">
    <template #overview>
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
                <TextWithCopyButton :text="props.zoneEgressOverview.name">
                  <RouterLink
                    :to="{
                      name: 'zone-egress-detail-view',
                      params: {
                        zoneEgress: props.zoneEgressOverview.name,
                      },
                    }"
                  >
                    {{ props.zoneEgressOverview.name }}
                  </RouterLink>
                </TextWithCopyButton>
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.type') }}
              </template>

              <template #body>
                {{ props.zoneEgressOverview.type }}
              </template>
            </DefinitionCard>
          </div>
        </template>
      </KCard>
    </template>

    <template #insights>
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
    </template>

    <template #xds-configuration>
      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error, refresh }: EnvoyDataSource"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/xds`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <EmptyBlock v-else-if="data === ''" />

            <EnvoyData
              v-else
              :content="data"
              query-key="envoy-data-xds-zone-egress"
              @refresh="refresh"
            />
          </DataSource>
        </template>
      </KCard>
    </template>

    <template #envoy-stats>
      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error, refresh }: EnvoyDataSource"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/stats`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <EmptyBlock v-else-if="data === ''" />

            <EnvoyData
              v-else
              :content="data"
              query-key="envoy-data-stats-zone-egress"
              @refresh="refresh"
            />
          </DataSource>
        </template>
      </KCard>
    </template>

    <template #envoy-clusters>
      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error, refresh }: EnvoyDataSource"
            :src="`/zone-egresses/${props.zoneEgressOverview.name}/data-path/clusters`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <EmptyBlock v-else-if="data === ''" />

            <EnvoyData
              v-else
              :content="data"
              query-key="envoy-data-clusters-zone-egress"
              @refresh="refresh"
            />
          </DataSource>
        </template>
      </KCard>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import { EnvoyDataSource } from '../sources'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
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
    hash: '#insights',
    title: t('zone-egresses.routes.item.tabs.insights'),
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
