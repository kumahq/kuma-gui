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
        {{ t('http.api.property.type') }}
      </template>

      <template #body>
        {{ t(`common.product.environment.${environment || 'unknown'}`) }}
      </template>
    </DefinitionCard>

    <DefinitionCard>
      <template #title>
        {{ t('zone-cps.routes.item.authentication_type') }}
      </template>

      <template #body>
        {{ authenticationType || t('common.not_applicable') }}
      </template>
    </DefinitionCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { getZoneControlPlaneEnvironment, getZoneControlPlaneStatus, getZoneDpServerAuthType } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import type { ZoneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  zoneOverview: ZoneOverview
}>()

const status = computed(() => getZoneControlPlaneStatus(props.zoneOverview))
const environment = computed(() => getZoneControlPlaneEnvironment(props.zoneOverview))
const authenticationType = computed(() => getZoneDpServerAuthType(props.zoneOverview))
</script>
