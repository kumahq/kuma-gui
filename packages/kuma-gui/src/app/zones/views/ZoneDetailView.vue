<template>
  <RouteView
    name="zone-cp-detail-view"
    :params="{
      zone: '',
      subscription: '',
    }"
    v-slot="{ t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-cps.routes.item.title', { name: props.data?.name })"
    />
    <AppView
      :docs="t('zones.href.docs.cta')"
      :notifications="true"
    >
      <XCard
        data-testid="zone-about-section"
      >
        <XTimespan
          :start="props.data && 'creationTime' in props.data ? props.data.creationTime : undefined"
          :end="props.data && 'modificationTime' in props.data ? props.data.modificationTime : undefined"
        />
        <template #title>
          {{ t('zone-cps.detail.about.title') }}
        </template>
        <DataLoader
          :data="[props.data]"
          v-slot="{ data: [zone] }"
        >
          <DataLoader
            :src="uri(sources, '/control-plane/outdated/:version', {
              version: zone.zoneInsight.version?.kumaCp?.version ?? '-',
            })"
            v-slot="{ data: [version] }"
          >
            <template
              v-for="{ bool, key, params } in [
                {
                  bool: zone.zoneInsight.store === 'memory',
                  key: 'store-memory',
                },
                {
                  bool: !zone.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
                  key: 'global-cp-incompatible',
                  params: {
                    zoneCpVersion: zone.zoneInsight.version?.kumaCp?.version ?? '-',
                    globalCpVersion: version?.version ?? '',
                  },
                },
                {
                  bool: (zone.zoneInsight.connectedSubscription?.status.total.responsesRejected ?? 0) > 0,
                  key: 'global-nack-response',
                },
              ]"
              :key="key"
            >
              <XNotification
                :notify="bool"
                :data-testid="`warning-${key}`"
                :uri="`zone-cps.notifications.${key}.${zone.id}`"
              >
                <XI18n
                  :path="`zone-cps.notifications.${key}`"
                  :params="Object.fromEntries(Object.entries(params ?? {}))"
                >
                  <template
                    v-if="key === 'global-nack-response'"
                    #link
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'zone-cp-subscription-summary-view',
                        params: {
                          subscription: zone.zoneInsight.connectedSubscription?.id,
                        },
                      }"
                    >
                      zone control plane summary
                    </XAction>
                  </template>
                </XI18n>
              </XNotification>
            </template>
            <XLayout
              variant="y-stack"
            >
              <XDl variant="x-stack">
                <div>
                  <dt>
                    {{ t('http.api.property.status') }}
                  </dt>
                  <dd>
                    <StatusBadge :status="zone.state" />
                  </dd>
                </div>
                <div
                  :class="{
                    version: true,
                    outdated: version?.outdated,
                  }"
                >
                  <dt>
                    {{ t('zone-cps.routes.item.version') }}
                  </dt>
                  <dd>
                    <XLayout variant="separated">
                      <XBadge
                        :appearance="version?.outdated === true ? 'warning' : 'decorative'"
                      >
                        {{ zone.zoneInsight.version?.kumaCp?.version ?? '—' }}
                      </XBadge>
                      <template
                        v-if="version?.outdated === true"
                      >
                        <XIcon
                          name="info"
                        >
                          <XI18n
                            path="zone-cps.routes.item.version_warning"
                          />
                        </XIcon>
                      </template>
                    </XLayout>
                  </dd>
                </div>
                <div>
                  <dt>
                    {{ t('http.api.property.type') }}
                  </dt>
                  <dd>
                    <XBadge appearance="decorative">
                      {{ t(`common.product.environment.${zone.zoneInsight.environment || 'unknown'}`) }}
                    </XBadge>
                  </dd>
                </div>
                <div>
                  <dt>
                    {{ t('zone-cps.routes.item.authentication_type') }}
                  </dt>
                  <dd>
                    <XBadge appearance="decorative">
                      {{ zone.zoneInsight.authenticationType || t('common.not_applicable') }}
                    </XBadge>
                  </dd>
                </div>
                <template
                  v-for="labels in [Object.entries(zone.labels)]"
                  :key="typeof labels"
                >
                  <div v-if="labels.length > 0">
                    <dt>{{ t('services.routes.item.labels') }}</dt>
                    <dd>
                      <XLayout
                        variant="separated"
                        truncate
                      >
                        <template
                          v-for="kumaRe in [/^(.+\.)?kuma\.io\//]"
                          :key="typeof kumaRe"
                        >
                          <XBadge
                            v-for="[key, value] in labels"
                            :key="key"
                            :appearance="kumaRe.test(key) ? 'info' : 'decorative'"
                          >
                            {{ key }}:{{ value }}
                          </XBadge>
                        </template>
                      </XLayout>
                    </dd>
                  </div>
                </template>
              </XDl>

              <XLayout
                v-if="zone.zoneInsight.subscriptions.length > 0"
                variant="y-stack"
                data-testid="about-zone-cp-subscriptions"
                class="about-subsection"
              >
                <XLayout variant="separated">
                  <h3>{{ t('zone-cps.routes.item.subscriptions.title') }}</h3>
                  <XAction
                    data-action
                    appearance="anchor"
                    :to="{
                      name: 'zone-cp-subscriptions-list-view',
                    }"
                  >
                    ({{ t('zone-cps.routes.item.subscriptions.show-details') }})
                  </XAction>
                </XLayout>
                <template
                  v-for="subscription in [zone.zoneInsight.connectedSubscription]"
                  :key="typeof subscription"
                >
                  <template v-if="!subscription?.disconnectTime && subscription?.connectTime">
                    <XDl variant="x-stack">
                      <div>
                        <dt>
                          {{ t('zone-cps.routes.item.subscriptions.connected') }}
                        </dt>
                        <dd>
                          <XBadge appearance="neutral">
                            {{ t('common.formats.datetime', { value: Date.parse(subscription.connectTime) }) }}
                          </XBadge>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          {{ t('zone-cps.routes.item.subscriptions.instanceId') }}
                        </dt>
                        <dd>
                          <XBadge appearance="info">
                            {{ subscription.zoneInstanceId }}
                          </XBadge>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          {{ t('zone-cps.routes.item.subscriptions.version') }}
                        </dt>
                        <dd>
                          <XBadge appearance="info">
                            {{ subscription.version?.kumaCp.version ?? t('common.unknown') }}
                          </XBadge>
                        </dd>
                      </div>
                    </XDl>
                  </template>
                  <template v-else>
                    <XI18n path="zone-cps.routes.item.subscriptions.disconnected" />
                  </template>
                </template>
              </XLayout>
            </XLayout>
          </DataLoader>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { sources } from '@/app/control-planes/sources'

const props = defineProps<{
  data: ZoneOverview | Error | undefined
}>()
</script>
<style lang="scss" scoped>
.about-subsection {
  border-top: var(--x-border-width-10) solid var(--x-color-border);
  padding-top: var(--x-space-70);
}
</style>
