<template>
  <div class="stack">
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

    <DefinitionCard>
      <template #title>
        {{ t('data-planes.routes.item.last_updated') }}
      </template>

      <template #body>
        <template v-if="lastUpdatedTime">
          {{ lastUpdatedTime }}
        </template>

        <template v-else>
          {{ t('common.detail.none') }}
        </template>
      </template>
    </DefinitionCard>

    <DefinitionCard>
      <template #title>
        {{ t('data-planes.routes.item.certificate_info') }}
      </template>

      <template #body>
        <template v-if="props.dataplaneOverview.dataplaneInsight?.mTLS?.certificateExpirationTime">
          {{ formatIsoDate(props.dataplaneOverview.dataplaneInsight?.mTLS.certificateExpirationTime) }}
        </template>

        <template v-else>
          {{ t('data-planes.routes.item.no_certificate') }}
        </template>
      </template>
    </DefinitionCard>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'
import { computed } from 'vue'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { dpTags, getStatusAndReason, getVersions } from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()

const props = defineProps<{
  dataplaneOverview: DataPlaneOverview
}>()

const statusWithReason = computed(() => getStatusAndReason(props.dataplaneOverview.dataplane, props.dataplaneOverview.dataplaneInsight))
const dataPlaneTags = computed(() => dpTags(props.dataplaneOverview.dataplane))
const dataPlaneVersions = computed(() => getVersions(props.dataplaneOverview.dataplaneInsight))
const lastUpdatedTime = computed(() => {
  const subscriptions = props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []

  if (subscriptions.length === 0) {
    return null
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]

  return formatIsoDate(lastSubscription.status.lastUpdateTime)
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
</style>
