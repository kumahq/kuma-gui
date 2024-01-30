<template>
  <span class="date-status">
    {{ t('common.detail.created') }}: {{ t('common.formats.datetime', { value: Date.parse(props.creationTime) }) }}

    {{ }}
    <ArrowRightIcon />

    {{ t('common.detail.modified') }}:{{ t('common.formats.datetime', { value: Date.parse(props.modificationTime) }) }}
  </span>
</template>

<script lang="ts" setup>
import { ArrowRightIcon } from '@kong/icons'

import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  creationTime: string
  modificationTime: string
}>()

</script>

<style lang="scss" scoped>
.date-status {
  display: inline-flex;
  align-items: flex-end;
  gap: $kui-space-50;
  color: $kui-color-text-neutral;
}
</style>
