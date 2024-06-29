<template>
  <RouteView
    v-slot="{ t, uri, route }"
    name="zone-cp-detail-view"
    :params="{
      zone: '',
      subscription: '',
    }"
  >
    <AppView>
      <template
        v-if="props.notifications.length > 0"
        #notifications
      >
        <ul>
          <li
            v-for="warning in props.notifications"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"

            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
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
            <DataSource
              v-slot="{ data: outdated }"
              :src="uri(sources, '/control-plane/outdated/:version', {
                version: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
              })"
            >
              <DefinitionCard
                :class="{
                  version: true,
                  outdated,
                }"
              >
                <template #title>
                  {{ t('zone-cps.routes.item.version') }}
                  <template
                    v-if="outdated === true"
                  >
                    <KTooltip
                      max-width="300"
                    >
                      <InfoIcon
                        :color="KUI_COLOR_BACKGROUND_NEUTRAL"
                        :size="KUI_ICON_SIZE_30"
                      />
                      <template #content>
                        <div
                          v-html="t('zone-cps.routes.item.version_warning')"
                        />
                      </template>
                    </KTooltip>
                  </template>
                </template>

                <template #body>
                  {{ props.data.zoneInsight.version?.kumaCp?.version ?? '—' }}
                </template>
              </DefinitionCard>
            </DataSource>
            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.type') }}
              </template>

              <template #body>
                {{ t(`common.product.environment.${props.data.zoneInsight.environment || 'unknown'}`) }}
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('zone-cps.routes.item.authentication_type') }}
              </template>

              <template #body>
                {{ props.data.zoneInsight.authenticationType || t('common.not_applicable') }}
              </template>
            </DefinitionCard>
          </div>
        </KCard>

        <div
          v-if="props.data.zoneInsight.subscriptions.length > 0"
        >
          <h2>{{ t('zone-cps.detail.subscriptions') }}</h2>
          <AppCollection
            :headers="[
              { label: 'Name', key: 'name' },
              { label: 'Connected', key: 'connected' },
              { label: 'Disconnected', key: 'disconnected' },
              { label: `Responses (sent/ack'ed)`, key: 'responses' },
              { label: 'Details', key: 'details', hideLabel: true },
            ]"
            :is-selected-row="item => item.id === route.params.subscription"
            :items="props.data.zoneInsight.subscriptions.map((item, i, arr) => arr[arr.length - (i + 1)])"
          >
            <template
              #name="{ row: item }"
            >
              <XAction
                data-action
                :to="{
                  name: 'subscription-summary-view',
                  params: {
                    subscription: item.id,
                  },
                }"
              >
                {{ item.zoneInstanceId }}
              </XAction>
            </template>
            <template
              #connected="{ row: item }"
            >
              {{ t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') }) }}
            </template>
            <template
              #disconnected="{ row: item }"
            >
              <template
                v-if="item.disconnectTime"
              >
                {{ t('common.formats.datetime', { value: Date.parse(item.disconnectTime) }) }}
              </template>
            </template>
            <template
              #responses="{ row: item }"
            >
              <template
                v-for="responses in [item.status?.total ?? {}]"
              >
                {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
              </template>
            </template>
          </AppCollection>
          <RouterView
            v-slot="{ Component }"
          >
            <SummaryView
              v-if="route.child()"
              width="670px"
              @close="function () {
                route.replace({
                  name: 'zone-cp-detail-view',
                  params: {
                    zone: route.params.zone,
                  },
                })
              }"
            >
              <component
                :is="Component"
                :data="props.data.zoneInsight.subscriptions"
              >
                <p>{{ t('zone-cps.routes.item.subscription_intro') }}</p>
              </component>
            </SummaryView>
          </RouterView>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'

import type { ZoneOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources } from '@/app/control-planes/sources'

const props = withDefaults(defineProps<{
  data: ZoneOverview
  notifications: { kind: string, payload: Record<string, string> }[]
}>(), {
  notifications: () => [],
})
</script>
<style lang="scss" scoped>
.version.outdated :deep(.definition-card-container) {
  color: #{$kui-color-text-warning};
}
</style>
