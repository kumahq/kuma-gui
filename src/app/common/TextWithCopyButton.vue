<template>
  <div class="copy-button-wrapper">
    <span class="text"><slot>{{ props.text }}</slot></span>

    <CopyButton
      :text="props.text"
      :copy-text="i18n.t('common.copyText')"
      :tooltip-success-text="i18n.t('common.copySuccessText')"
    />
  </div>
</template>

<script lang="ts" setup>
import CopyButton from './CopyButton.vue'
import { useI18n } from '@/utilities'

const i18n = useI18n()

const props = defineProps<{
  text: string
}>()
</script>

<style lang="scss" scoped>
.copy-button-wrapper {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-40;
}

.text {
  min-width: 0;
  word-wrap: break-word;
}
</style>
