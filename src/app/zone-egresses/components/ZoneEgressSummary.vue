<template>
  <div class="stack">
    <DefinitionCard>
      <template #title>
        {{ t('http.api.property.status') }}
      </template>

      <template #body>
        <StatusBadge :status="status" />
      </template>
    </DefinitionCard>

    <DefinitionCard>
      <template #title>
        {{ t('http.api.property.address') }}
      </template>

      <template #body>
        <template v-if="address">
          <TextWithCopyButton :text="address" />
        </template>

        <template v-else>
          {{ t('common.detail.none') }}
        </template>
      </template>
    </DefinitionCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  zoneEgressOverview: ZoneEgressOverview
}>()

const status = computed(() => getItemStatusFromInsight(props.zoneEgressOverview.zoneEgressInsight))
const address = computed(() => {
  const { networking } = props.zoneEgressOverview.zoneEgress

  if (networking?.address && networking?.port) {
    return `${networking.address}:${networking.port}`
  }

  return null
})
</script>
