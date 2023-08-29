<template>
  <RouteView
    name="zone-egress-detail-view"
    data-testid="zone-egress-detail-view"
  >
    <AppView>
      <div
        class="stack"
        data-testid="detail-view-details"
      >
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

        <KCard>
          <template #body>
            <SubscriptionList :subscriptions="props.data.zoneEgressInsight?.subscriptions ?? []" />
          </template>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
