<template>
  <div class="stack">
    <div class="stack-with-borders">
      <DefinitionCard layout="horizontal">
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
              position-fixed
            >
              <InfoIcon
                :size="KUI_ICON_SIZE_30"
                hide-title
              />
            </KTooltip>
          </div>
        </template>
      </DefinitionCard>

      <DefinitionCard layout="horizontal">
        <template #title>
          {{ t('data-planes.routes.item.last_updated') }}
        </template>

        <template #body>
          <template v-if="formattedLastUpdateTime">
            {{ formattedLastUpdateTime }}
          </template>

          <template v-else>
            {{ t('common.detail.none') }}
          </template>
        </template>
      </DefinitionCard>
    </div>

    <div v-if="props.dataplaneOverview.dataplane.networking.gateway">
      <h3>{{ t('data-planes.routes.item.gateway') }}</h3>

      <div class="mt-4">
        <div class="stack-with-borders">
          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.tags') }}
            </template>

            <template #body>
              <TagList :tags="props.dataplaneOverview.dataplane.networking.gateway.tags" />
            </template>
          </DefinitionCard>

          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              <TextWithCopyButton :text="`${props.dataplaneOverview.dataplane.networking.address}`" />
            </template>
          </DefinitionCard>
        </div>
      </div>
    </div>

    <div v-if="props.dataplaneOverview.dataplane.networking.inbound">
      <h3>{{ t('data-planes.routes.item.inbounds') }}</h3>

      <div class="mt-4">
        <div class="stack">
          <div
            v-for="(inbound, index) in props.dataplaneOverview.dataplane.networking.inbound"
            :key="index"
            class="inbound"
          >
            <h4>
              <TextWithCopyButton :text="inbound.tags['kuma.io/service']">
                {{ t('data-planes.routes.item.inbound_name', { service: inbound.tags['kuma.io/service'] }) }}
              </TextWithCopyButton>
            </h4>

            <div class="mt-2 stack-with-borders">
              <DefinitionCard layout="horizontal">
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

              <DefinitionCard layout="horizontal">
                <template #title>
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <TagList
                    class="dataplane-tag-list"
                    :tags="inbound.tags"
                    should-truncate
                  />
                </template>
              </DefinitionCard>

              <DefinitionCard layout="horizontal">
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <TextWithCopyButton :text="`${inbound.address ?? props.dataplaneOverview.dataplane.networking.advertisedAddress ?? props.dataplaneOverview.dataplane.networking.address}:${inbound.port}`" />
                </template>
              </DefinitionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'
import { computed } from 'vue'

import { getLastUpdateTime } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getStatusAndReason } from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()

const props = defineProps<{
  dataplaneOverview: DataPlaneOverview
}>()

const statusWithReason = computed(() => getStatusAndReason(props.dataplaneOverview.dataplane, props.dataplaneOverview.dataplaneInsight))
const formattedLastUpdateTime = computed(() => {
  const lastUpdateTime = getLastUpdateTime(props.dataplaneOverview.dataplaneInsight?.subscriptions ?? [])
  return lastUpdateTime !== undefined ? formatIsoDate(lastUpdateTime) : t('common.detail.none')
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

.dataplane-tag-list :deep(.k-truncate-container) {
  justify-content: flex-end;
}
</style>
