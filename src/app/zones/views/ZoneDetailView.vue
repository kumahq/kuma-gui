<template>
  <RouteView
    v-slot="{ t }"
    name="zone-cp-detail-view"
  >
    <AppView>
      <template
        v-if="props.notifications.length > 0"
        #notifications
      >
        <ul>
          <!-- eslint-disable vue/no-v-html  -->
          <li
            v-for="warning in props.notifications"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"

            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
          <!-- eslint-enable -->
        </ul>
      </template>
      <div
        data-testid="detail-view-details"
        class="stack"
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
                {{ t('http.api.property.type') }}
              </template>

              <template #body>
                {{ t(`common.product.environment.${props.data.zoneInsight?.environment || 'unknown'}`) }}
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('zone-cps.routes.item.authentication_type') }}
              </template>

              <template #body>
                {{ props.data.zoneInsight?.authenticationType || t('common.not_applicable') }}
              </template>
            </DefinitionCard>
          </div>
        </KCard>

        <template
          v-for="subscriptions in [props.data.zoneInsight?.subscriptions ?? []]"
          :key="subscriptions"
        >
          <div
            v-if="subscriptions.length > 0"
          >
            <h2>{{ t('zone-cps.detail.subscriptions') }}</h2>

            <KCard class="mt-4">
              <SubscriptionList
                :subscriptions="subscriptions"
              >
                <p>{{ t('zone-cps.routes.item.subscription_intro') }}</p>
              </SubscriptionList>
            </KCard>
          </div>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'

const props = withDefaults(defineProps<{
  data: ZoneOverview
  notifications: { kind: string, payload: Record<string, string> }[]
}>(), {
  notifications: () => [],
})
</script>
