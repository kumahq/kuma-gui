<template>
  <RouteView
    v-slot="{ t }"
    name="data-plane-detail-view"
  >
    <AppView>
      <template
        v-if="warnings.length > 0"
        #notifications
      >
        <ul>
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
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <TagList
                    v-if="dataPlaneTags.length > 0"
                    :tags="dataPlaneTags"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.dependencies') }}
                </template>

                <template #body>
                  <TagList
                    v-if="dataPlaneVersions !== null"
                    :tags="dataPlaneVersions"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <div>
          <h2>{{ t('data-planes.routes.item.mtls.title') }}</h2>

          <template
            v-if="props.data.dataplaneInsight?.mTLS"
          >
            <template
              v-for="mTLS in [
                props.data.dataplaneInsight.mTLS
              ]"
              :key="mTLS"
            >
              <KCard
                class="mt-4"
              >
                <template #body>
                  <div
                    class="columns"
                    style="--columns: 5;"
                  >
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
import { KAlert, KCard, KTooltip } from '@kong/kongponents'
import { computed } from 'vue'

import { useCan } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import TagList from '@/app/common/TagList.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import {
  compatibilityKind,
  COMPATIBLE,
  dpTags,
  getStatusAndReason,
  getVersions,
  INCOMPATIBLE_WRONG_FORMAT,
} from '@/utilities/dataplane'

const { formatIsoDate } = useI18n()
const can = useCan()

const props = defineProps<{
  data: DataPlaneOverview
}>()

const statusWithReason = computed(() => getStatusAndReason(props.data.dataplane, props.data.dataplaneInsight))
const dataPlaneTags = computed(() => dpTags(props.data.dataplane))
const dataPlaneVersions = computed(() => getVersions(props.data.dataplaneInsight))

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
</style>

<style lang="scss">
.reason-tooltip .kong-icon {
  display: flex;
  align-items: center;
}
</style>
