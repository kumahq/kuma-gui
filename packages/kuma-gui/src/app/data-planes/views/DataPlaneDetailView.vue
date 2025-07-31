<template>
  <RouteView
    :params="{
      inactive: Boolean,
      mesh: '',
      proxy: '',
      proxyType: '',
      subscription: '',
    }"
    name="data-plane-detail-view"
    v-slot="{ route, t, can, me }"
  >
    <AppView
      :notifications="true"
    >
      <template
        v-for="{ bool, key, params, variant } in [
          {
            bool: props.data.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false,
            key: 'dp-cp-incompatible',
            params: {
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: props.data.dataplaneInsight.version?.envoy?.kumaDpCompatible === false,
            key: 'envoy-dp-incompatible',
            params: {
              envoy: props.data.dataplaneInsight.version?.envoy.version ?? '',
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: !!(can('use zones') && props.data.zone && props.data.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false),
            key: 'dp-zone-cp-incompatible',
            params: {
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: props.data.isCertExpiresSoon,
            key: 'certificate-expires-soon',
          },
          {
            bool: props.data.isCertExpired,
            key: 'certificate-expired',
          },
          {
            bool: !props.data.dataplaneInsight.mTLS,
            key: 'no-mtls',
          },
          {
            bool: !can('use transparent-proxying', props.data),
            key: 'networking-transparent-proxying',
            variant: 'info' as const,
          },
        ]"
        :key="key"
      >
        <XNotification
          :notify="bool"
          :data-testid="`warning-${key}`"
          :uri="`data-planes.notifications.${key}.${props.data.id}`"
          :variant="variant"
        >
          <XI18n
            :path="`data-planes.notifications.${key}`"
            :params="Object.fromEntries(Object.entries(params ?? {}))"
          />
        </XNotification>
      </template>

      <XLayout
        type="stack"
        data-testid="dataplane-details"
      >
        <XAboutCard
          :title="t('data-planes.routes.item.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
          class="about-section"
        >
          <XLayout>
            <XLayout
              type="separated"
            >
              <DefinitionCard
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('http.api.property.status') }}
                </template>

                <template
                  #body
                >
                  <XLayout
                    type="separated"
                  >
                    <StatusBadge :status="props.data.status" />
                    <DataCollection
                      v-if="props.data.dataplaneType === 'standard'"
                      :items="props.data.dataplane.networking.inbounds"
                      :predicate="item => item.state !== 'Ready'"
                      :empty="false"
                      v-slot="{ items: unhealthyInbounds }"
                    >
                      <XIcon name="info">
                        <ul>
                          <li
                            v-for="inbound in unhealthyInbounds"
                            :key="`${inbound.service}:${inbound.port}`"
                          >
                            {{ t('data-planes.routes.item.unhealthy_inbound', { service: inbound.service, port: inbound.port }) }}
                          </li>
                        </ul>
                      </XIcon>
                    </DataCollection>
                  </XLayout>
                </template>
              </DefinitionCard>

              <DefinitionCard
                v-if="can('use zones') && props.data.zone"
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('http.api.property.zone') }}
                </template>
                <template
                  #body
                >
                  <XBadge appearance="decorative">
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: props.data.zone,
                        },
                      }"
                    >
                      {{ props.data.zone }}
                    </XAction>
                  </XBadge>
                </template>
              </DefinitionCard>
              <DefinitionCard layout="horizontal">
                <template
                  #title
                >
                  {{ t('http.api.proptery.type') }}
                </template>

                <template
                  #body
                >
                  <XBadge appearance="decorative">
                    {{ t(`data-planes.type.${props.data.dataplaneType}`) }}
                  </XBadge>
                </template>
              </DefinitionCard>

              <DefinitionCard
                v-if="props.data.namespace.length > 0"
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('http.api.property.namespace') }}
                </template>

                <template
                  #body
                >
                  <XBadge
                    appearance="decorative"
                  >
                    {{ props.data.namespace }}
                  </XBadge>
                </template>
              </DefinitionCard>

              <DefinitionCard
                layout="horizontal"
              >
                <template
                  #title
                >
                  {{ t('http.api.property.address') }}
                </template>

                <template
                  #body
                >
                  <XCopyButton
                    variant="badge"
                    format="default"
                    :text="`${props.data.dataplane.networking.address}`"
                  />
                </template>
              </DefinitionCard>

              <template
                v-if="props.data.dataplane.networking.gateway"
              >
                <DefinitionCard
                  layout="horizontal"
                >
                  <template
                    #title
                  >
                    {{ t('http.api.property.tags') }}
                  </template>

                  <template
                    #body
                  >
                    <TagList
                      :tags="props.data.dataplane.networking.gateway.tags"
                    />
                  </template>
                </DefinitionCard>
              </template>
            </XLayout>

            <XLayout
              v-if="props.data.dataplaneInsight.mTLS"
              data-testid="dataplane-mtls"
              class="dataplane-mtls"
              size="small"
            >
              <h3>{{ t('data-planes.routes.item.mtls.title') }}</h3>
              <XLayout size="small">
                <template
                  v-for="mTLS in [
                    props.data.dataplaneInsight.mTLS,
                  ]"
                  :key="mTLS"
                >
                  <XLayout type="separated">
                    <DefinitionCard layout="horizontal">
                      <template #title>
                        <XI18n
                          path="data-planes.routes.item.mtls.generation_time.title"
                        />
                      </template>

                      <template #body>
                        <XBadge appearance="neutral">
                          {{ t('common.formats.datetime', { value: Date.parse(mTLS.lastCertificateRegeneration) }) }}
                        </XBadge>
                      </template>
                    </DefinitionCard>
                    <DefinitionCard layout="horizontal">
                      <template #title>
                        <XI18n
                          path="data-planes.routes.item.mtls.expiration_time.title"
                        />
                      </template>

                      <template #body>
                        <XBadge appearance="neutral">
                          {{ t('common.formats.datetime', { value: Date.parse(mTLS.certificateExpirationTime) }) }}
                        </XBadge>
                      </template>
                    </DefinitionCard>
                  </XLayout>
                  <XLayout type="separated">
                    <DefinitionCard layout="horizontal">
                      <template
                        #title
                      >
                        {{ t('data-planes.routes.item.mtls.regenerations.title') }}
                      </template>

                      <template
                        #body
                      >
                        <XBadge appearance="info">
                          {{ t('common.formats.integer', { value: mTLS.certificateRegenerations }) }}
                        </XBadge>
                      </template>
                    </DefinitionCard>

                    <DefinitionCard layout="horizontal">
                      <template
                        #title
                      >
                        {{ t('data-planes.routes.item.mtls.issued_backend.title') }}
                      </template>

                      <template
                        #body
                      >
                        <XBadge appearance="decorative">
                          {{ mTLS.issuedBackend }}
                        </XBadge>
                      </template>
                    </DefinitionCard>

                    <DefinitionCard layout="horizontal">
                      <template
                        #title
                      >
                        {{ t('data-planes.routes.item.mtls.supported_backends.title') }}
                      </template>

                      <template
                        #body
                      >
                        <XLayout
                          type="separated"
                          truncate
                        >
                          <XBadge
                            v-for="item in mTLS.supportedBackends"
                            :key="item"
                            :appearance="item === mTLS.issuedBackend ? 'decorative' : 'info'"
                          >
                            {{ item }}
                          </XBadge>
                        </XLayout>
                      </template>
                    </DefinitionCard>
                  </XLayout>
                </template>
              </XLayout>
            </XLayout>
          </XLayout>
        </XAboutCard>

        <!-- Placeholder traffic inbounds/outbounds -->

        <RouterView
          v-slot="child"
        >
          <SummaryView
            v-if="child.route.name !== route.name"
            width="670px"
            @close="function () {
              route.replace({
                name: 'data-plane-detail-view',
                params: {
                  mesh: route.params.mesh,
                  proxy: route.params.proxy,
                },
                query: {
                  inactive: route.params.inactive ? null : undefined,
                },
              })

            }"
          >
            <component
              :is="child.Component"
              :data="route.params.subscription.length > 0 ? props.data.dataplaneInsight.subscriptions : (child.route.name as string).includes('-inbound-') ? props.data.dataplane.networking.inbounds : {}"
              :networking="props.data.dataplane.networking"
            />
          </SummaryView>
        </RouterView>

        <div
          v-if="props.data.dataplaneInsight.subscriptions.length > 0"
          data-testid="dataplane-subscriptions"
        >
          <XCard>
            <template
              #title
            >
              <h2>{{ t('data-planes.routes.item.subscriptions.title') }}</h2>
            </template>

            <XLayout>
              <XI18n path="data-planes.routes.item.subscriptions.description" />
              <AppCollection
                :headers="[
                  { ...me.get('headers.connection'), label: '&nbsp;', key: 'connection' },
                  { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
                  { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
                  { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
                  { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
                  { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
                ]"
                :is-selected-row="item => item.id === route.params.subscription"
                :items="props.data.dataplaneInsight.subscriptions.map((_, i, arr) => arr[arr.length - (i + 1)])"
                @resize="me.set"
              >
                <template
                  #connection="{ row: item }"
                >
                  <template
                    v-for="connection in [item.connectTime && !item.disconnectTime ? 'healthy' : 'unhealthy'] as const"
                    :key="`${connection}`"
                  >
                    <XIcon :name="connection">
                      {{ t(`common.connection.${connection}`) }}
                    </XIcon>
                  </template>
                </template>
                <template
                  #instanceId="{ row: item }"
                >
                  <XAction
                    data-action
                    :to="{
                      name: 'data-plane-subscription-summary-view',
                      params: {
                        subscription: item.id,
                      },
                    }"
                  >
                    {{ item.controlPlaneInstanceId }}
                  </XAction>
                </template>
                <template
                  #version="{ row: item }"
                >
                  {{ item.version?.kumaDp?.version ?? '-' }}
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
            </XLayout>
          </XCard>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import type { DataplaneOverview } from '@/app/legacy-data-planes/data'
import type { Mesh } from '@/app/meshes/data'
import { useRoute } from '@/app/vue'

const _route = useRoute()

const props = defineProps<{
  data: DataplaneOverview
  mesh: Mesh
}>()
</script>

<style lang="scss" scoped>
.service-traffic-group:not(.type-passthrough) .service-traffic-card {
  cursor: pointer;
}

.traffic {
  padding: 0;
  container-type: inline-size;
  container-name: traffic;

  .columns {
    padding: $kui-space-40;
    background: linear-gradient(90deg, rgba(0, 0, 0, .1) 1px, transparent 1px);
    background-position: 100% 0;
    background-repeat: repeat-y;
    background-size: 50%;
  }
}

.traffic .tag-list {
  margin-left: auto;
}

:deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

@container traffic (max-width: 40.95rem) {
  .traffic .columns {
    background: none;
  }
}

.dataplane-mtls {
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-70;

  h3 {
    color: $kui-color-text;
  }
}

:deep(.about-section .about-section-content) {
  display: block !important;
}
</style>
