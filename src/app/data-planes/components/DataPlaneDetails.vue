<template>
  <div class="stack">
    <WarningsWidget
      v-if="warnings.length > 0"
      :warnings="warnings"
      data-testid="data-plane-warnings"
    />

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
                  <KIcon
                    icon="info"
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
      <h2>{{ t('data-planes.detail.mtls') }}</h2>

      <KAlert
        v-if="mtlsData === null"
        class="mt-4"
        appearance="warning"
      >
        <template #alertMessage>
          {{ t('data-planes.detail.no_mtls') }} —
          <a
            :href="t('data-planes.href.docs.mutual-tls')"
            class="external-link"
            target="_blank"
          >
            {{ t('data-planes.detail.no_mtls_learn_more', { product: t('common.product.name') }) }}
          </a>
        </template>
      </KAlert>

      <KCard
        v-else
        class="mt-4"
      >
        <template #body>
          <div
            class="columns"
            style="--columns: 3;"
          >
            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.certificateExpirationTime') }}
              </template>

              <template #body>
                {{ mtlsData.certificateExpirationTime }}
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.lastCertificateRegeneration') }}
              </template>

              <template #body>
                {{ mtlsData.lastCertificateRegeneration }}
              </template>
            </DefinitionCard>

            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.certificateRegenerations') }}
              </template>

              <template #body>
                {{ mtlsData.certificateRegenerations }}
              </template>
            </DefinitionCard>
          </div>
        </template>
      </KCard>
    </div>

    <div v-if="(props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []).length > 0">
      <h2>{{ t('data-planes.detail.subscriptions') }}</h2>

      <KCard class="mt-4">
        <template #body>
          <SubscriptionList :subscriptions="props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []" />
        </template>
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KAlert, KCard, KIcon, KTooltip } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import { useCan } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import TagList from '@/app/common/TagList.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import { KUMA_ZONE_TAG_NAME } from '@/constants'
import { Compatibility, DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import {
  compatibilityKind,
  COMPATIBLE,
  dpTags,
  getStatusAndReason,
  getVersions,
  INCOMPATIBLE_WRONG_FORMAT,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
  parseMTLSData,
} from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()
const can = useCan()

const props = defineProps({
  dataplaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const statusWithReason = computed(() => getStatusAndReason(props.dataplaneOverview.dataplane, props.dataplaneOverview.dataplaneInsight))
const dataPlaneTags = computed(() => dpTags(props.dataplaneOverview.dataplane))
const dataPlaneVersions = computed(() => getVersions(props.dataplaneOverview.dataplaneInsight))
const mtlsData = computed(() => parseMTLSData(props.dataplaneOverview, formatIsoDate))

const warnings = computed(() => {
  const subscriptions = props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []
  if (subscriptions.length === 0) {
    return []
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  if (!('version' in lastSubscription) || !lastSubscription.version) {
    return []
  }

  const warnings: Compatibility[] = []
  const version = lastSubscription.version

  if (version.kumaDp && version.envoy) {
    const compatibility = compatibilityKind(version)

    if (compatibility.kind !== COMPATIBLE && compatibility.kind !== INCOMPATIBLE_WRONG_FORMAT) {
      warnings.push(compatibility)
    }
  }

  if (can('use zones')) {
    const tags = dpTags(props.dataplaneOverview.dataplane)
    const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.push({
        kind: INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
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
