<template>
  <ZoneControlPlanesList
    v-bind="$attrs"
    :items="props.items"
  />
  <!-- put the create button either in the empty state or above the list -->
  <!-- depending on whether we are empty or not -->
  <XTeleportTemplate
    v-if="props.items"
    :to="{
      name: (props.items.length > 0) ? 'control-plane-detail-view-zone-actions' : 'zones-crud-x-empty-state-actions',
    }"
  >
    <XAction
      type="create"
      appearance="primary"
      :to="{ name: 'zone-create-view' }"
    >
      {{ t('zones-crud.index.create') }}
    </XAction>
  </XTeleportTemplate>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'
import ZoneControlPlanesList from '@/app/zones/components/ZoneControlPlanesList.vue'
import type { ZoneOverview } from '@/app/zones/data'

const { t } = useI18n()
const props = defineProps<{
  items?: ZoneOverview[]
}>()
</script>
