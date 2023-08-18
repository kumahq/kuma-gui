<template>
  <div class="stack">
    <KCard>
      <template #body>
        <div
          class="columns"
          style="--columns: 4;"
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
              {{ t('http.api.property.name') }}
            </template>

            <template #body>
              <TextWithCopyButton :text="props.serviceInsight.name">
                <RouterLink
                  :to="{
                    name: 'service-detail-view',
                    params: {
                      service: props.serviceInsight.name,
                      mesh: props.serviceInsight.mesh,
                    },
                  }"
                >
                  {{ props.serviceInsight.name }}
                </RouterLink>
              </TextWithCopyButton>
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              {{ props.serviceInsight.addressPort ?? t('common.detail.none') }}
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
