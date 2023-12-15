<template>
  <div class="stack">
    <DefinitionCard>
      <template #title>
        {{ t('http.api.property.status') }}
      </template>

      <template #body>
        <StatusBadge :status="props.zoneEgressOverview.state" />
      </template>
    </DefinitionCard>

    <DefinitionCard>
      <template #title>
        {{ t('http.api.property.address') }}
      </template>

      <template #body>
        <template v-if="props.zoneEgressOverview.zoneEgress.socketAddress.length > 0">
          <TextWithCopyButton :text="props.zoneEgressOverview.zoneEgress.socketAddress" />
        </template>

        <template v-else>
          {{ t('common.detail.none') }}
        </template>
      </template>
    </DefinitionCard>
  </div>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  zoneEgressOverview: ZoneEgressOverview
}>()
</script>
