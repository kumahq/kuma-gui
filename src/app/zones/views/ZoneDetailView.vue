<template>
  <RouteView
    v-slot="{ t, uri }"
    name="zone-cp-detail-view"
  >
    <DataSource
      v-slot="{ data: version }"
      :src="uri(sources, '/control-plane/outdated/:version', {
        version: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
      })"
    >
      <AppView>
        <template
          v-if="props.data.warnings.length > 0"
          #notifications
        >
          <ul>
            <li
              v-for="warning in props.data.warnings"
              :key="warning.kind"
              :data-testid="`warning-${warning.kind}`"
              v-html="t(`common.warnings.${warning.kind}`, {
                ...warning.payload,
                ...(warning.kind === 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS' ? {
                  globalCpVersion: version?.version ?? '',
                } : {}),
              })"
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
              <DefinitionCard
                :class="{
                  version: true,
                  outdated: version?.outdated,
                }"
              >
                <template #title>
                  {{ t('zone-cps.routes.item.version') }}
                  <template
                    v-if="version?.outdated === true"
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

            <KCard class="mt-4">
              <SubscriptionList
                :subscriptions="props.data.zoneInsight.subscriptions"
              >
                <p>{{ t('zone-cps.routes.item.subscription_intro') }}</p>
              </SubscriptionList>
            </KCard>
          </div>
        </div>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'

import type { ZoneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { sources } from '@/app/control-planes/sources'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'

const props = defineProps<{
  data: ZoneOverview
}>()
</script>
<style lang="scss" scoped>
.version.outdated :deep(.definition-card-container) {
  color: #{$kui-color-text-warning};
}
</style>
