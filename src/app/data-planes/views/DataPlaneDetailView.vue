<template>
  <RouteView name="data-plane-detail-view">
    <AppView>
      <template
        v-if="warnings.length > 0"
        #notifications
      >
        <ul data-testid="dataplane-warnings">
          <!-- eslint-disable vue/no-v-html  -->
          <li
            v-for="warning in warnings"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"
            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
          <!-- eslint-enable -->
        </ul>
      </template>

      <div
        class="stack"
        data-testid="dataplane-details"
      >
        <KCard>
          <template #body>
            <div class="columns">
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <div class="status-with-reason">
                    <StatusBadge :status="statusWithReason.status" />

                    <KTooltip
                      v-if="statusWithReason.reason.length > 0"
                      :label="statusWithReason.reason.join(', ')"
                      class="reason-tooltip"
                    >
                      <InfoIcon
                        :size="KUI_ICON_SIZE_30"
                        hide-title
                      />
                    </KTooltip>
                  </div>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('data-planes.routes.item.last_updated') }}
                </template>

                <template #body>
                  {{ formattedLastUpdatedTime }}
                </template>
              </DefinitionCard>

              <template v-if="props.data.dataplane.networking.gateway">
                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.tags') }}
                  </template>

                  <template #body>
                    <TagList :tags="props.data.dataplane.networking.gateway.tags" />
                  </template>
                </DefinitionCard>

                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.address') }}
                  </template>

                  <template #body>
                    <TextWithCopyButton :text="`${props.data.dataplane.networking.address}`" />
                  </template>
                </DefinitionCard>
              </template>
            </div>
          </template>
        </KCard>

        <div
          v-if="props.data.dataplane.networking.inbound && props.data.dataplane.networking.inbound.length > 0"
          data-testid="dataplane-inbounds"
        >
          <h2>{{ t('data-planes.routes.item.inbounds') }}</h2>

          <KCard class="mt-4">
            <template #body>
              <div class="inbound-list">
                <div
                  v-for="(inbound, index) in props.data.dataplane.networking.inbound"
                  :key="index"
                  class="inbound"
                >
                  <h4>
                    <TextWithCopyButton :text="inbound.tags['kuma.io/service']">
                      {{ t('data-planes.routes.item.inbound_name', { service: inbound.tags['kuma.io/service'] }) }}
                    </TextWithCopyButton>
                  </h4>

                  <div class="mt-4 columns">
                    <DefinitionCard>
                      <template #title>
                        {{ t('http.api.property.status') }}
                      </template>

                      <template #body>
                        <KBadge
                          v-if="!inbound.health || inbound.health.ready"
                          appearance="success"
                        >
                          {{ t('data-planes.routes.item.health.ready') }}
                        </KBadge>

                        <KBadge
                          v-else
                          appearance="danger"
                        >
                          {{ t('data-planes.routes.item.health.not_ready') }}
                        </KBadge>
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('http.api.property.tags') }}
                      </template>

                      <template #body>
                        <TagList :tags="inbound.tags" />
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('http.api.property.address') }}
                      </template>

                      <template #body>
                        <TextWithCopyButton :text="`${inbound.address ?? props.data.dataplane.networking.advertisedAddress ?? props.data.dataplane.networking.address}:${inbound.port}`" />
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('http.api.property.serviceAddress') }}
                      </template>

                      <template #body>
                        <TextWithCopyButton :text="`${inbound.serviceAddress ?? inbound.address ?? props.data.dataplane.networking.address}:${inbound.servicePort ?? inbound.port}`" />
                      </template>
                    </DefinitionCard>
                  </div>
                </div>
              </div>
            </template>
          </KCard>
        </div>

        <div data-testid="dataplane-mtls">
          <h2>{{ t('data-planes.routes.item.mtls.title') }}</h2>

          <template
            v-if="props.data.dataplaneInsight?.mTLS"
          >
            <template
              v-for="mTLS in [
                props.data.dataplaneInsight.mTLS,
              ]"
              :key="mTLS"
            >
              <KCard
                class="mt-4"
              >
                <template #body>
                  <div class="columns">
                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.expiration_time.title') }}
                      </template>

                      <template #body>
                        {{ formatIsoDate(mTLS.certificateExpirationTime) }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.generation_time.title') }}
                      </template>

                      <template #body>
                        {{ formatIsoDate(mTLS.lastCertificateRegeneration) }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.regenerations.title') }}
                      </template>

                      <template #body>
                        {{ t('common.formats.integer', {value: mTLS.certificateRegenerations}) }}
                      </template>
                    </DefinitionCard>
                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.issued_backend.title') }}
                      </template>

                      <template #body>
                        {{ mTLS.issuedBackend }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.supported_backends.title') }}
                      </template>

                      <template #body>
                        <ul>
                          <li
                            v-for="item in mTLS.supportedBackends"
                            :key="item"
                          >
                            {{ item }}
                          </li>
                        </ul>
                      </template>
                    </DefinitionCard>
                  </div>
                </template>
              </KCard>
            </template>
          </template>

          <template
            v-else
          >
            <KAlert
              class="mt-4"
              appearance="warning"
            >
              <template #alertMessage>
                <div
                  v-html="t('data-planes.routes.item.mtls.disabled')"
                />
              </template>
            </KAlert>
          </template>
        </div>

        <template
          v-for="subscriptions in [props.data.dataplaneInsight?.subscriptions ?? []]"
          :key="subscriptions"
        >
          <div
            v-if="subscriptions.length > 0"
            data-testid="dataplane-subscriptions"
          >
            <h2>{{ t('data-planes.routes.item.subscriptions.title') }}</h2>

            <KCard class="mt-4">
              <template #body>
                <SubscriptionList
                  :subscriptions="subscriptions"
                />
              </template>
            </KCard>
          </div>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'
import { computed } from 'vue'

import { getFormattedLastUpdateTime } from '../data'
import { useCan } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import {
  compatibilityKind,
  COMPATIBLE,
  dpTags,
  getStatusAndReason,
  INCOMPATIBLE_WRONG_FORMAT,
} from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()
const can = useCan()

const props = defineProps<{
  data: DataPlaneOverview
}>()

const statusWithReason = computed(() => getStatusAndReason(props.data.dataplane, props.data.dataplaneInsight))

const formattedLastUpdatedTime = computed(() => {
  const lastUpdatedTime = getFormattedLastUpdateTime(props.data.dataplaneInsight?.subscriptions ?? [])
  return lastUpdatedTime !== null ? formatIsoDate(lastUpdatedTime) : t('common.detail.none')
})

const warnings = computed(() => {
  const subscriptions = props.data.dataplaneInsight?.subscriptions ?? []
  if (subscriptions.length === 0) {
    return []
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  if (!('version' in lastSubscription) || !lastSubscription.version) {
    return []
  }

  const version = lastSubscription.version

  const warnings: { kind: string, payload?: any }[] = []
  if (version.kumaDp && version.envoy) {
    const compatibility = compatibilityKind(version)

    if (compatibility.kind !== COMPATIBLE && compatibility.kind !== INCOMPATIBLE_WRONG_FORMAT) {
      warnings.push(compatibility)
    }
  }
  const mTLS = props.data.dataplaneInsight?.mTLS
  if (
    mTLS &&
    (Date.now() > new Date(mTLS?.certificateExpirationTime).getTime())
  ) {
    warnings.push({
      kind: 'CERT_EXPIRED',
      payload: {},
    })
  }

  if (can('use zones')) {
    const tags = dpTags(props.data.dataplane)
    const zoneTag = tags.find(tag => tag.label === 'kuma.io/zone')

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS',
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  return warnings
})

</script>

<style lang="scss" scoped>
.status-with-reason {
  display: flex;
  align-items: center;
  gap: $kui-space-50;
}

.reason-tooltip :deep(.kong-icon) {
  display: flex;
  align-items: center;
}

.inbound-list>*+* {
  margin-block-start: $kui-space-60;
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-block-start: $kui-space-60;
}
</style>
