<template>
  <RouteView
    name="zone-cp-detail-view"
    :params="{
      zone: '',
      subscription: '',
    }"
    v-slot="{ t, uri, route, me }"
  >
    <DataSource
      :src="uri(sources, '/control-plane/outdated/:version', {
        version: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
      })"
      v-slot="{ data: version }"
    >
      <AppView
        :docs="t('zones.href.docs.cta')"
      >
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
        <XLayout
          data-testid="detail-view-details"
          type="stack"
        >
          <XAboutSection
            :title="t('zone-cps.detail.about.title')"
            :created="props.data.creationTime"
            :modified="props.data.modificationTime"
          >
            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.status') }}
              </template>

              <template #body>
                <StatusBadge :status="props.data.state" />
              </template>
            </DefinitionCard>
            <DefinitionCard
              layout="horizontal"
              :class="{
                version: true,
                outdated: version?.outdated,
              }"
            >
              <template #title>
                {{ t('zone-cps.routes.item.version') }}
              </template>

              <template #body>
                <XLayout type="separated">
                  <XBadge appearance="decorative">
                    {{ props.data.zoneInsight.version?.kumaCp?.version ?? '—' }}
                  </XBadge>
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
                </XLayout>
              </template>
            </DefinitionCard>
            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.type') }}
              </template>

              <template #body>
                <XBadge appearance="decorative">
                  {{ t(`common.product.environment.${props.data.zoneInsight.environment || 'unknown'}`) }}
                </XBadge>
              </template>
            </DefinitionCard>

            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('zone-cps.routes.item.authentication_type') }}
              </template>

              <template #body>
                <XBadge appearance="decorative">
                  {{ props.data.zoneInsight.authenticationType || t('common.not_applicable') }}
                </XBadge>
              </template>
            </DefinitionCard>
          </XAboutSection>

          <div
            v-if="props.data.zoneInsight.subscriptions.length > 0"
          >
            <h2>{{ t('zone-cps.detail.subscriptions') }}</h2>
            <AppCollection
              :headers="[
                { ...me.get('headers.zoneInstanceId'), label: t('zone-cps.routes.items.headers.zoneInstanceId'), key: 'zoneInstanceId' },
                { ...me.get('headers.version'), label: t('zone-cps.routes.items.headers.version'), key: 'version' },
                { ...me.get('headers.connected'), label: t('zone-cps.routes.items.headers.connected'), key: 'connected' },
                { ...me.get('headers.disconnected'), label: t('zone-cps.routes.items.headers.disconnected'), key: 'disconnected' },
                { ...me.get('headers.responses'), label: t('zone-cps.routes.items.headers.responses'), key: 'responses' },
              ]"
              :is-selected-row="item => item.id === route.params.subscription"
              :items="props.data.zoneInsight.subscriptions.map((item, i, arr) => arr[arr.length - (i + 1)])"
              @resize="me.set"
            >
              <template
                #zoneInstanceId="{ row: item }"
              >
                <XAction
                  data-action
                  :to="{
                    name: 'zone-cp-subscription-summary-view',
                    params: {
                      subscription: item.id,
                    },
                  }"
                >
                  {{ item.zoneInstanceId }}
                </XAction>
              </template>
              <template
                #version="{ row: item }"
              >
                {{ item.version?.kumaCp?.version ?? '-' }}
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
        </XLayout>
      </AppView>
    </DataSource>
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

const props = defineProps<{
  data: ZoneOverview
}>()
</script>
<style lang="scss" scoped>
.version.outdated :deep(.definition-card-container) {
  color: #{$kui-color-text-warning};
}
</style>
