<template>
  <div class="copy-button-wrapper">
    <slot>
      <component :is="props.tag">
        {{ props.text }}
      </component>
    </slot>

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

const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    required: false,
    default: 'span',
  },
})
</script>

<style lang="scss" scoped>
.copy-button-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
