<template>
  <RouteView
    v-slot="{ t }"
    name="zone-ingress-detail-view"
  >
    <AppView>
      <div
        class="stack"
        data-testid="detail-view-details"
      >
        <KCard>
          <div class="columns">
            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.status') }}
              </template>

              <template #body>
                <StatusBadge :status="props.data.state" />
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.address') }}
              </template>

              <template #body>
                <template v-if="props.data.zoneIngress.socketAddress.length > 0">
                  <TextWithCopyButton :text="props.data.zoneIngress.socketAddress" />
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
                <template v-if="props.data.zoneIngress.advertisedSocketAddress.length > 0">
                  <TextWithCopyButton :text="props.data.zoneIngress.advertisedSocketAddress" />
                </template>

                <template v-else>
                  {{ t('common.detail.none') }}
                </template>
              </template>
            </DefinitionCard>
          </div>
        </KCard>

        <template
          v-for="subscriptions in [props.data.zoneIngressInsight?.subscriptions ?? []]"
          :key="subscriptions"
        >
          <div
            v-if="subscriptions.length > 0"
          >
            <h2>{{ t('zone-ingresses.routes.item.subscriptions.title') }}</h2>

            <KCard class="mt-4">
              <SubscriptionList
                :subscriptions="subscriptions"
              />
            </KCard>
          </div>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'

const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
