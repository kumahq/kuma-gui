<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
<script lang="ts" setup>
import { inject, watch } from 'vue'

import { useI18n } from '../../'
import type { Ref } from 'vue'

const { t } = useI18n()
const xCard = inject<{
  created: Ref<string>
  modified: Ref<string>
} | undefined>('x-card', undefined)
const props = defineProps<{
  start?: string | number
  end?: string | number
}>()
watch(
  [() => props.start, () => props.end],
  () => {
    if (typeof xCard !== 'undefined') {
      if (typeof props.start !== 'undefined') {
        const start = typeof props.start === 'string' ? Date.parse(props.start) : props.start
        xCard.created.value = isNaN(start) ? String(props.start) : t('common.formats.datetime', { value: String(start) })
      }
      if (typeof props.end !== 'undefined') {
        const end = typeof props.end === 'string' ? Date.parse(props.end) : props.end
        xCard.modified.value = isNaN(end) ? String(props.end) : t('common.formats.datetime', { value: String(end) })
      }
    }
  },
  { immediate: true },
)
</script>
