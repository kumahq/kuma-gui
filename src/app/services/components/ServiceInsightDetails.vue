<template>
  <div class="stack">
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
              <StatusBadge :status="props.serviceInsight.status ?? 'not_available'" />
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              <TextWithCopyButton
                v-if="props.serviceInsight.addressPort"
                :text="props.serviceInsight.addressPort"
              />

              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>

          <ResourceStatus
            :online="props.serviceInsight.dataplanes?.online ?? 0"
            :total="props.serviceInsight.dataplanes?.total ?? 0"
          >
            <template #title>
              {{ t('http.api.property.dataPlaneProxies') }}
            </template>
          </ResourceStatus>
        </div>
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  serviceInsight: ServiceInsight
}>()
</script>
