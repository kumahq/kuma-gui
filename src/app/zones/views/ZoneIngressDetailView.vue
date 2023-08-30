<template>
  <RouteView
    name="zone-ingress-detail-view"
    data-testid="zone-ingress-detail-view"
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
              style="--columns: 3;"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge :status="getItemStatusFromInsight(props.data.zoneIngressInsight)" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <template v-if="props.data.zoneIngress.networking?.address && props.data.zoneIngress.networking?.port">
                    <TextWithCopyButton :text="`${props.data.zoneIngress.networking.address}:${props.data.zoneIngress.networking.port}`" />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.advertisedAddress') }}
                </template>

                <template #body>
                  <template v-if="props.data.zoneIngress.networking?.advertisedAddress && props.data.zoneIngress.networking?.advertisedPort">
                    <TextWithCopyButton :text="`${props.data.zoneIngress.networking.advertisedAddress}:${props.data.zoneIngress.networking.advertisedPort}`" />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <div v-if="(data.zoneIngressInsight?.subscriptions ?? []).length > 0">
          <h2>{{ t('zone-ingresses.detail.subscriptions') }}</h2>

          <KCard class="mt-4">
            <template #body>
              <SubscriptionList :subscriptions="data.zoneIngressInsight?.subscriptions ?? []" />
            </template>
          </KCard>
        </div>
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
import type { ZoneIngressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
