<template>
  <span class="date-status">
    {{ t('common.detail.created') }}: {{ createdDate }}

    <KIcon icon="arrowRight" />

    {{ t('common.detail.modified') }}: {{ modifiedDate }}
  </span>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'
import { computed } from 'vue'

import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

const props = defineProps<{
  creationTime: string
  modificationTime: string
}>()

const createdDate = computed(() => formatIsoDate(props.creationTime))
const modifiedDate = computed(() => formatIsoDate(props.modificationTime))
</script>

<style lang="scss" scoped>
.date-status {
  display: inline-flex;
  align-items: flex-end;
  gap: $kui-space-50;
  color: $kui-color-text-neutral;
}
</style>
