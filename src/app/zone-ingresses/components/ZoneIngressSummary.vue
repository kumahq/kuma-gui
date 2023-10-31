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

    <DefinitionCard>
      <template #title>
        {{ t('http.api.property.advertisedAddress') }}
      </template>

      <template #body>
        <template v-if="advertisedAddress">
          <TextWithCopyButton :text="advertisedAddress" />
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
import type { ZoneIngressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  zoneIngressOverview: ZoneIngressOverview
}>()

const status = computed(() => getItemStatusFromInsight(props.zoneIngressOverview.zoneIngressInsight))
const address = computed(() => {
  const { networking } = props.zoneIngressOverview.zoneIngress

  if (networking?.address && networking?.port) {
    return `${networking.address}:${networking.port}`
  }

  return null
})
const advertisedAddress = computed(() => {
  const { networking } = props.zoneIngressOverview.zoneIngress

  if (networking?.advertisedAddress && networking?.advertisedPort) {
    return `${networking.advertisedAddress}:${networking.advertisedPort}`
  }

  return null
})
</script>
