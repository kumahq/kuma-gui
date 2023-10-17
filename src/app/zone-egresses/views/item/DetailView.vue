<template>
  <RouteView
    v-slot="{ t }"
    name="zone-egress-detail-view"
  >
    <AppView>
      <div
        class="stack"
        data-testid="detail-view-details"
      >
        <KCard>
          <template #body>
            <div class="columns">
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge :status="getItemStatusFromInsight(props.data.zoneEgressInsight)" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <template v-if="props.data.zoneEgress.networking?.address && props.data.zoneEgress.networking?.port">
                    <TextWithCopyButton :text="`${props.data.zoneEgress.networking.address}:${props.data.zoneEgress.networking.port}`" />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <template
          v-for="subscriptions in [props.data.zoneEgressInsight?.subscriptions ?? []]"
          :key="subscriptions"
        >
          <div
            v-if="subscriptions.length > 0"
          >
            <h2>{{ t('zone-egresses.routes.item.subscriptions.title') }}</h2>

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
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
