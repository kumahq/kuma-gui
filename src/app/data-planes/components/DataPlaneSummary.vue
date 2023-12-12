<template>
  <div class="stack">
    <div class="stack-with-borders">
      <DefinitionCard layout="horizontal">
        <template #title>
          {{ t('http.api.property.status') }}
        </template>

        <template #body>
          <div class="status-with-reason">
            <StatusBadge :status="props.dataplaneOverview.status" />

            <KTooltip
              v-if="props.dataplaneOverview.unhealthyInbounds.length > 0"
              :label="props.dataplaneOverview.unhealthyInbounds.map((inbound) => t('data-planes.routes.item.unhealthy_inbound', inbound)).join(', ')"
              class="reason-tooltip"
              position-fixed
            >
              <InfoIcon
                :color="KUI_COLOR_BACKGROUND_NEUTRAL"
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
          <template v-if="props.dataplaneOverview.lastUpdateTime">
            {{ formatIsoDate(props.dataplaneOverview.lastUpdateTime) }}
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
              <TagList
                alignment="right"
                :tags="props.dataplaneOverview.dataplane.networking.gateway.tags"
              />
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
                    alignment="right"
                    :tags="inbound.tags"
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
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'

import type { DataplaneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

const props = defineProps<{
  dataplaneOverview: DataplaneOverview
}>()
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
