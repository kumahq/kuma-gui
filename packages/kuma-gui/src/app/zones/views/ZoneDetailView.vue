<template>
  <RouteView
    name="zone-cp-detail-view"
    :params="{
      zone: '',
      subscription: '',
    }"
    v-slot="{ t, uri }"
  >
    <DataSource
      :src="uri(sources, '/control-plane/outdated/:version', {
        version: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
      })"
      v-slot="{ data: version }"
    >
      <AppView
        :docs="t('zones.href.docs.cta')"
        :notifications="true"
      >
        <template
          v-for="{ bool, key, params } in [
            {
              bool: props.data.zoneInsight.store === 'memory',
              key: 'store-memory',
            },
            {
              bool: !props.data.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
              key: 'global-cp-incompatible',
              params: {
                zoneCpVersion: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
                globalCpVersion: version?.version ?? '',
              },
            },
            {
              bool: (props.data.zoneInsight.connectedSubscription?.status.total.responsesRejected ?? 0) > 0,
              key: 'global-nack-response',
            },
          ]"
          :key="key"
        >
          <XNotification
            :notify="bool"
            :data-testid="`warning-${key}`"
            :uri="`zone-cps.notifications.${key}.${props.data.id}`"
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
                      subscription: props.data.zoneInsight.connectedSubscription?.id,
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
          data-testid="detail-view-details"
          type="stack"
        >
          <XAboutCard
            :title="t('zone-cps.detail.about.title')"
            :created="props.data.creationTime"
            :modified="props.data.modificationTime"
            class="about-section"
          >
            <XLayout>
              <XLayout type="separated">
                <XDl variant="x-stack">
                  <div>
                    <dt>
                      {{ t('http.api.property.status') }}
                    </dt>
                    <dd>
                      <StatusBadge :status="props.data.state" />
                    </dd>
                  </div>
                </XDl>
                <XDl variant="x-stack">
                  <div>
                    <dt>
                      {{ t('zone-cps.routes.item.version') }}
                    </dt>
                    <dd>
                      <XLayout type="separated">
                        <XBadge
                          :appearance="version?.outdated === true ? 'warning' : 'decorative'"
                        >
                          {{ props.data.zoneInsight.version?.kumaCp?.version ?? '—' }}
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
                </XDl>
                <XDl variant="x-stack">
                  <div>
                    <dt>
                      {{ t('http.api.property.type') }}
                    </dt>
                    <dd>
                      <XBadge appearance="decorative">
                        {{ t(`common.product.environment.${props.data.zoneInsight.environment || 'unknown'}`) }}
                      </XBadge>
                    </dd>
                  </div>
                </XDl>
                <XDl variant="x-stack">
                  <div>
                    <dt>
                      {{ t('zone-cps.routes.item.authentication_type') }}
                    </dt>
                    <dd>
                      <XBadge appearance="decorative">
                        {{ props.data.zoneInsight.authenticationType || t('common.not_applicable') }}
                      </XBadge>
                    </dd>
                  </div>
                </XDl>
              </XLayout>

              <XLayout
                v-if="props.data.zoneInsight.subscriptions.length > 0"
                data-testid="about-zone-cp-subscriptions"
                class="about-subsection"
              >
                <XLayout type="separated">
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
                <XLayout
                  v-for="subscription in [props.data.zoneInsight.connectedSubscription]"
                  :key="typeof subscription"
                  type="separated"
                >
                  <template v-if="!subscription?.disconnectTime && subscription?.connectTime">
                    <XDl variant="x-stack">
                      <div>
                        <dt>
                          <XI18n
                            path="zone-cps.routes.item.subscriptions.connected"
                          />
                        </dt>
                        <dd>
                          <XBadge appearance="neutral">
                            {{ t('common.formats.datetime', { value: Date.parse(subscription.connectTime) }) }}
                          </XBadge>
                        </dd>
                      </div>
                    </XDl>
                    <XDl variant="x-stack">
                      <div>
                        <dt>
                          <XI18n
                            path="zone-cps.routes.item.subscriptions.instanceId"
                          />
                        </dt>
                        <dd>
                          <XBadge appearance="info">
                            {{ subscription.zoneInstanceId }}
                          </XBadge>
                        </dd>
                      </div>
                    </XDl>
                    <XDl variant="x-stack">
                      <div>
                        <dt>
                          <XI18n
                            path="zone-cps.routes.item.subscriptions.version"
                          />
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
                </XLayout>
              </XLayout>
            </XLayout>
          </XAboutCard>
        </XLayout>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { sources } from '@/app/control-planes/sources'

const props = defineProps<{
  data: ZoneOverview
}>()
</script>
<style lang="scss" scoped>
.about-subsection {
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-70;
}

:deep(.about-section .about-section-content) {
  display: block !important;

  h3 {
    color: $kui-color-text;
  }
}
</style>
